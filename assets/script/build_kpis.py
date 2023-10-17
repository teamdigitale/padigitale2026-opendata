import pandas as pd
import requests

KPI_FOLDER = 'data/KPI/'
AVVISI_URL = 'https://raw.githubusercontent.com/teamdigitale/padigitale2026-opendata/main/data/avvisi.csv'
TEMPLATE_URL = 'https://raw.githubusercontent.com/teamdigitale/padigitale2026-opendata/main/data/candidature_TEMPLATE_finanziate.csv'
MAP_MONTH = {'Jan':'Gen','Feb':'Feb', 'Mar':'Mar', 'Apr':'Apr', 'May':'Mag','Jun':'Giu','Jul':'Lug','Aug':'Ago','Sep':'Set','Oct':'Ott','Nov':'Nov','Dec':'Dic'}

df_avvisi = pd.read_csv(AVVISI_URL)

df_finanziate = pd.concat(
    [
        pd.read_csv(TEMPLATE_URL.replace('TEMPLATE',code), dtype={'cod_comune':str,'importo_finanziamento': int}) for code in ('comuni','scuole','altrienti')
        ]
    )   
# step added to momentarily fix missing dates in 'data_invio_candidatura'
print('Loaded Datasets!')

### KPI_0: importi complessivi
misura_max_importo = df_avvisi.groupby('misura').totale_importo_misura.max().sum().astype(int)
risorse_decretate = df_finanziate.loc[df_finanziate.stato_candidatura != 'R', 'importo_finanziamento'].sum()
risorse_erogate = df_finanziate.loc[df_finanziate.stato_candidatura == 'E', 'importo_finanziamento'].sum()

KPI_0 = pd.DataFrame.from_dict({
    'Totale Dotazione Misura': misura_max_importo,
    'Totale Risorse Decretate': risorse_decretate,
    'Totale Risorse Erogate': risorse_erogate
}, orient='index')

KPI_0.to_csv(KPI_FOLDER+'totale_risorse.csv', header=False)


### KPI_1: Importi per misura

df_fin_agg = df_finanziate.groupby(['avviso','stato_candidatura']).importo_finanziamento.sum().reset_index().copy()
KPI_1 = df_fin_agg.merge(
    df_avvisi,left_on='avviso',right_on='titolo',how='left',validate='m:1'
    ).where(df_fin_agg.stato_candidatura!='R').groupby(['misura']).agg({'importo_finanziamento':'sum','totale_importo_misura':'max'}).T
tmp_KPI = df_fin_agg.merge(df_avvisi,left_on='avviso',right_on='titolo',how='left',validate='m:1').where(df_fin_agg.stato_candidatura=='E').groupby(['misura']).agg({'importo_finanziamento':'sum'}).rename(columns={'importo_finanziamento':'importo_erogato'}).T
KPI_1 = pd.concat([KPI_1,tmp_KPI], axis=0).fillna(0)
KPI_1.index.name = 'Misura'
KPI_1.astype(int).to_csv(KPI_FOLDER+'totale_per_misura.csv')

### KPI_2: FINANZIAMENTO PER COMUNE

r = requests.get('https://raw.githubusercontent.com/openpolis/geojson-italy/master/geojson/limits_IT_municipalities.geojson')
geojson = r.json()
mapper_geojson = {
    city['properties']['com_istat_code']:city['properties']['name']
    for city in geojson['features']
}
# Merge dataframes directly in one step
KPI_2 = pd.DataFrame.from_dict(mapper_geojson, orient='index').reset_index().rename(columns={'index':'cod_comune',0:'name'})
KPI_2 = KPI_2.merge(df_finanziate.loc[df_finanziate['stato_candidatura'] != 'R', ['cod_comune', 'importo_finanziamento']].groupby('cod_comune').sum().reset_index(), on='cod_comune', how='left')

# Convert column to integer and fill missing values with zero
KPI_2['importo_finanziamento'] = KPI_2['importo_finanziamento'].fillna(0).astype(int)

# Write dataframe to CSV without index column
KPI_2[['name', 'importo_finanziamento']].to_csv(KPI_FOLDER+'importi_per_comune.csv', index=False)

### KPI_3: Partecipanti
KPI_3 = df_finanziate[['tipologia_ente', 'codice_ipa']].drop_duplicates().groupby('tipologia_ente').size().reset_index(name='Numero Enti Distinti')
KPI_3.rename(columns={'tipologia_ente':'Tipologia Ente'}).to_csv(KPI_FOLDER+'pantecipanti_per_tipologia.csv', index=False)

### KPI_4: andamento importi

df_finanziate['Data invio'] = pd.to_datetime(df_finanziate.data_invio_candidatura.ffill(), errors='ignore').dt.date
inviate = df_finanziate.groupby('Data invio').importo_finanziamento.sum().reset_index()
inviate['evento'] = 'Invio Candidatura'
inviate.columns=['Data','Importo Finanziamento','Evento']

finanziate = df_finanziate.groupby('data_finanziamento').importo_finanziamento.sum().reset_index()
finanziate['evento'] = 'Decretato'
finanziate.columns=['Data','Importo Finanziamento','Evento']
finanziate['Data'] = pd.to_datetime(finanziate['Data']).dt.date

rinunce = df_finanziate[df_finanziate.stato_candidatura=='R'].groupby('data_stato_candidatura').importo_finanziamento.sum().reset_index()
rinunce['evento'] = 'Rinuncia finanziamento'
rinunce.columns=['Data','Importo Finanziamento','Evento']
rinunce['Data'] = pd.to_datetime(rinunce['Data']).dt.date

erogate = df_finanziate[df_finanziate.stato_candidatura=='E'].copy()
erogate['Data Erogazione'] = pd.to_datetime(erogate.data_stato_candidatura).dt.date
erogate = erogate.groupby('Data Erogazione').importo_finanziamento.sum().reset_index()
erogate['evento'] = 'Erogazione finanziamento'
erogate.columns=['Data','Importo Finanziamento','Evento']

events = pd.concat([finanziate,rinunce,erogate],axis=0)
events.sort_values(by='Data', inplace=True, ascending=True)
events['Mese'] = pd.to_datetime(events.Data).dt.strftime('%b %Y')

def generate_month_list(dates):
    dates = pd.to_datetime(events.Data)
    min_date = dates.min().strftime('%b %Y')
    # print(min_date)
    max_date = dates.max().strftime('%b %Y')
    # print(max_date)

    # Generate a range of monthly dates between min_date and max_date
    month_range = pd.date_range(start=min_date, end=max_date, freq='MS', inclusive='both')
    # print(month_range)

    # Convert the dates to the desired format '%b %Y' and add them to a list
    month_list = [date.strftime('%b %Y') for date in month_range]

    return month_list

list1 = generate_month_list(events.Data)
list2 = list(events.Evento.unique())
print(list1)

KPI_4 = pd.DataFrame({'Mese':list1}).merge(pd.DataFrame({'Evento':list2}), how='cross')
print(KPI_4)
tmp = KPI_4.merge(
    events, on=['Mese','Evento'], how='left'
    ).pivot_table(
    index='Evento',values='Importo Finanziamento', columns='Mese', sort = False, aggfunc = sum
    ).fillna(0).astype(int).copy()
print(tmp)
tmp.columns = [ MAP_MONTH[col.split(' ')[0]]+' '+col.split(' ')[1] for col in list1]
tmp.to_csv(KPI_FOLDER+'andamento_progetti.csv')

### KPI_5: importo per tipologia ente e Regione

tipologia_ente = df_finanziate.tipologia_ente.unique()
regione = df_finanziate.regione.unique()
KPI_5 = pd.DataFrame({'tipologia_ente':tipologia_ente}).merge(pd.DataFrame({'regione':regione}), how = 'cross')

KPI_5 = KPI_5.merge(df_finanziate[df_finanziate.stato_candidatura=='E'].groupby(['tipologia_ente','regione']).importo_finanziamento.sum().reset_index(), on = ['tipologia_ente','regione'], how='left')
KPI_5.columns=['Tipologia Ente', 'Regione','Importo Finanziamento']
KPI_5.pivot_table(index='Tipologia Ente',values='Importo Finanziamento',columns='Regione', aggfunc=sum).fillna(0).astype(int).to_csv(KPI_FOLDER+'importo_per_tipologia.csv')

### KPI_6: IMPORTO PER REGIONE E MISURA

misura = df_avvisi.misura.unique()
temp = pd.DataFrame({'Misura':misura}).merge(pd.DataFrame({'Regione':regione}),how='cross')

KPI_6 = df_finanziate[df_finanziate.stato_candidatura=='E'].groupby(['avviso','regione']).importo_finanziamento.sum().reset_index()
KPI_6 = KPI_6.merge(df_avvisi[['titolo','misura']],left_on='avviso',right_on='titolo',how='left',validate='m:1')

KPI_6.columns=['Avviso','Regione','Importo Finanziamento','titolo','Misura']

temp.merge(KPI_6, on=['Misura','Regione'],how='left').pivot_table(index='Misura',values='Importo Finanziamento',columns='Regione', aggfunc=sum).fillna(0).astype(int).to_csv(KPI_FOLDER+'importo_per_misura.csv')