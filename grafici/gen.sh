#!/usr/bin/env bash

SF=../node_modules/.bin/sf

$SF data query --query "SELECT outfunds__Applying_Organization__r.Regione__c, COUNT(Id) FROM outfunds__Funding_Request__c WHERE Data_Finanziamento__c != null and Finestra_Temporale__r.Protocollo_n__c != null GROUP BY outfunds__Applying_Organization__r.Regione__c" -r csv \
  --output-file="progetti_sul_territorio_tutti.csv"

$SF data query --query "SELECT outfunds__Applying_Organization__r.Regione__c, COUNT(Id) FROM outfunds__Funding_Request__c WHERE Data_Finanziamento__c != null and Finestra_Temporale__r.Protocollo_n__c != null and outfunds__FundingProgram__r.Name LIKE '1.1%' GROUP BY outfunds__Applying_Organization__r.Regione__c" -r csv \
  --output-file="progetti_sul_territorio_1.1.csv"


$SF data query --query "SELECT outfunds__Applying_Organization__r.Regione__c, COUNT(Id) FROM outfunds__Funding_Request__c WHERE Data_Finanziamento__c != null and Finestra_Temporale__r.Protocollo_n__c != null and outfunds__FundingProgram__r.Name LIKE '1.2%' GROUP BY outfunds__Applying_Organization__r.Regione__c" -r csv \
  --output-file="progetti_sul_territorio_1.2.csv"


$SF data query --query "SELECT outfunds__Applying_Organization__r.Regione__c, COUNT(Id) FROM outfunds__Funding_Request__c WHERE Data_Finanziamento__c != null and Finestra_Temporale__r.Protocollo_n__c != null and outfunds__FundingProgram__r.Name LIKE '1.3.1%' GROUP BY outfunds__Applying_Organization__r.Regione__c" -r csv \
  --output-file="progetti_sul_territorio_1.3.1.csv"


$SF data query --query "SELECT outfunds__Applying_Organization__r.Regione__c, COUNT(Id) FROM outfunds__Funding_Request__c WHERE Data_Finanziamento__c != null and Finestra_Temporale__r.Protocollo_n__c != null and outfunds__FundingProgram__r.Name LIKE '1.4.1%' GROUP BY outfunds__Applying_Organization__r.Regione__c" -r csv \
  --output-file="progetti_sul_territorio_1.4.1.csv"
  

$SF data query --query "SELECT outfunds__Applying_Organization__r.Regione__c, COUNT(Id) FROM outfunds__Funding_Request__c WHERE Data_Finanziamento__c != null and Finestra_Temporale__r.Protocollo_n__c != null and outfunds__FundingProgram__r.Name LIKE '1.4.3%app IO%' GROUP BY outfunds__Applying_Organization__r.Regione__c" -r csv \
  --output-file="progetti_sul_territorio_1.4.3_app_io.csv"
  
$SF data query --query "SELECT outfunds__Applying_Organization__r.Regione__c, COUNT(Id) FROM outfunds__Funding_Request__c WHERE Data_Finanziamento__c != null and Finestra_Temporale__r.Protocollo_n__c != null and outfunds__FundingProgram__r.Name LIKE '1.4.3%pagoPA%' GROUP BY outfunds__Applying_Organization__r.Regione__c" -r csv \
  --output-file="progetti_sul_territorio_1.4.3_pagoPA.csv"
  
$SF data query --query "SELECT outfunds__Applying_Organization__r.Regione__c, COUNT(Id) FROM outfunds__Funding_Request__c WHERE Data_Finanziamento__c != null and Finestra_Temporale__r.Protocollo_n__c != null and outfunds__FundingProgram__r.Name LIKE '1.4.4%SPID%' GROUP BY outfunds__Applying_Organization__r.Regione__c" -r csv \
  --output-file="progetti_sul_territorio_1.4.4_spid.csv"
  
$SF data query --query "SELECT outfunds__Applying_Organization__r.Regione__c, COUNT(Id) FROM outfunds__Funding_Request__c WHERE Data_Finanziamento__c != null and Finestra_Temporale__r.Protocollo_n__c != null and outfunds__FundingProgram__r.Name LIKE '1.4.4%ansc%' GROUP BY outfunds__Applying_Organization__r.Regione__c" -r csv \
  --output-file="progetti_sul_territorio_1.4.4_ansc.csv"
  
$SF data query --query "SELECT outfunds__Applying_Organization__r.Regione__c, COUNT(Id) FROM outfunds__Funding_Request__c WHERE Data_Finanziamento__c != null and Finestra_Temporale__r.Protocollo_n__c != null and outfunds__FundingProgram__r.Name LIKE '1.4.5%' GROUP BY outfunds__Applying_Organization__r.Regione__c" -r csv \
  --output-file="progetti_sul_territorio_1.4.5.csv"
  

enti=(
    ASL
    "Università"
    "Istituti di ricerca e AFAM"
    "Aziende Ospedaliere"
    "Agenzie Regionali Sanitarie"
    Comuni
    Scuole
    "PA Centrali"
    "Province"
    "Enti Regionali"
    "Altri enti"
    "Citta Metropolitane"
    "AOO"
    "Istituti Zooprofilattici Sperimentali"
)

for ente in "${enti[@]}"; do
echo "$ente"
$SF data query --query "SELECT SUM(Fondi_disponibili__c) FROM outfunds__Funding_Program__c WHERE outfunds__Parent_Funding_Program__c != null and SOGGETTI_DESTINATARI__C includes ('$ente')"
done