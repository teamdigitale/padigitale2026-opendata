import pandas as pd
import os

TYPE_DICT = {'cod_comune':'object', 'cod_provincia':'object','cod_regione':'object'}

def main():
    DATA_DIR = 'data'
    avvisi = 'avvisi.csv'
    files = [entry for entry in os.listdir(DATA_DIR) if entry.endswith('finanziate.csv')]
    print(files)

    df = pd.concat(
        [pd.read_csv(os.path.join(DATA_DIR, file), dtype=TYPE_DICT ) for file in files], 
        axis = 0, ignore_index = True 
    )

    df_avvisi = pd.read_csv(os.path.join(DATA_DIR,avvisi),usecols=[0,1])
    mapping_dict = dict(zip(df_avvisi.titolo, df_avvisi.misura))

    df['misura'] = df['avviso'].replace('"',"'").replace('“',"'").map(mapping_dict)
    
    def extract_tipologia(funding_program):
        if 'Comuni' in funding_program:
            return 'Comune'
        elif 'Scuole' in funding_program:
            return 'Scuole'
        elif 'ASL/AO' in funding_program:
            return 'ASL/AO'
        else:
            return 'Altri Enti'
    
    # df['tipologia_ente'] = df['avviso'].map(lambda x: extract_tipologia(x))

    for misura in set(mapping_dict.values()):
        tmp_df = df[df['misura']==misura]
        if len(tmp_df)>0:
            output_file = 'candidature_finanziate_'+''.join(filter(str.isdigit, misura))
            tmp_df.to_csv(
                os.path.join(DATA_DIR,output_file)+'.csv' , 
                header=True, index=False)
            tmp_df.to_json(
                os.path.join(DATA_DIR,output_file) + '.json', orient='records'
                )
    del tmp_df

if __name__=="__main__":
    main()
