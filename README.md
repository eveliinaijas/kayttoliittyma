🎯 Tavoite
Sovellus työntekijöiden poissaolojen ilmoittamiseen ja esihenkilöiden hyväksyntään. Hyväksytyt poissaolot näkyvät kalenterissa.

👥 Roolit
Työntekijä: kirjautuu, ilmoittaa poissaolon, näkee omat poissaolot
Esihenkilö: kirjautuu, hyväksyy/hylkää lomakkeet
Kaikki: näkevät kalenterin

📝 Lomake
Kentät: nimi, alkupäivä, päättymispäivä, syy
Hyväksyntä: loma/saldovapaa/muu → hyväksyntä vaaditaan, muut → automaattinen hyväksyntä

🔐 Kirjautuminen
Sähköposti + salasana
Roolipohjainen näkymä
Käytetään esim. Firebase Auth tai Auth0

📅 Kalenteri
2 viikon näkymä
Värikoodaus syyn mukaan
Navigointi nuolilla

🧱 Tekninen rakenne
Backend (Flask): login, lomake, hyväksyntä, listaus
Frontend (React): kirjautuminen, lomake, hyväksyntä, kalenteri
Tallennus: users.json, absences.json

🗓️ Aikataulu
Suunnittelu ja backend
Frontend: kirjautuminen, lomake, hyväksyntä
Kalenterinäkymä
Viimeistely ja esitys