# Code Reality Readme

This is work in progress...

Code Reality framework enables building networked extended reality (XR) experiences with A-Frame.

aframe-dataspace servers provide a shared space to store and transmit scene data between browsers.

## Environments

Production:
* https://app.codereality.io/

Public test:
* https://test.codereality.io/

## Browser support

Tested browsers (latest versions):

* Windows / Firefox
* Windows / Chrome
* macOS / Firefox
* macOS / Chrome
* macOS / Safari
* iOS / Safari

Tested devices:

* HTC Vive
* Oculus Go (Oculus Browser)

## Build

npm run build:node
npm run build:browser

## Add to heroku
---
    heroku create --region eu code-reality
    git push heroku master
    heroku logs -t
    heroku logs -t --dyno=web
---

## Run

### Development mode

To run the node http server in development mode you need to run locally the
following commands in separate terminals:

1) npm run dev:node
2) npm run dev:browser

Browse to: http://localhost:3001/

## Access control

### Authentication

Currently implemented authentication method is facebook authentication with express passport.

### Authorization

Authorization to rest and web socket services are transmitted with JWT token. 
The trusted issuer public keys are listed in cluster configuration.

#### Generating key pair

RSA key pair can be generated as follows:

    openssl genrsa -aes128 -out private.pem 2048
    openssl rsa -in private.pem -outform PEM -pubout -out public.pem
    openssl base64 -in private.pem -out private.base64
    openssl base64 -in public.pem -out public.base64

Windows base64 encode:

    certutil -encode public.pem tmp.b64; findstr /v /c:- tmp.b64 > public.b64; rm tmp.b64
    certutil -encode private.pem tmp.b64; findstr /v /c:- tmp.b64 > private.b64; rm tmp.b64

### Public test environment JWT signer RSA key pair:

-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEApl9jOIkv7+MQpc3Y1UTz
9DNSXQeQJRI8IgkHoyKT2FXlaty+DBh42qLdcsRUWhT6BcTdV++3MI9mUluUA8zc
6s/oYR/Q3D8FJUi2Oe8VXhv1/edDQU2TguYaBvxiVZYXlXuDkjU05iKMYdiBcFp8
8t4FDFPUMRGgMNWpIDxGOeCxN0v8ott3OBkFHyokGdxMvu1q5KVS4Y60D8UgC/4i
IGE3QCLqIzZ+jm0o8vAqgJG/rAL5UmufR+KnWdIIVfHyhZwxFjWuurfPZwKX23aj
gcIDFjPf1XdeWdEViCGADeaiYfyrCk5E+I7x38Zj1eHqljJYh6o2jaKJxHsH0ZJK
uwIDAQAB
-----END PUBLIC KEY-----

Base64 encoded pem:
LS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS0KTUlJQklqQU5CZ2txaGtpRzl3MEJBUUVGQUFPQ0FROEFNSUlCQ2dLQ0FRRUFwbDlqT0lrdjcrTVFwYzNZMVVUego5RE5TWFFlUUpSSThJZ2tIb3lLVDJGWGxhdHkrREJoNDJxTGRjc1JVV2hUNkJjVGRWKyszTUk5bVVsdVVBOHpjCjZzL29ZUi9RM0Q4RkpVaTJPZThWWGh2MS9lZERRVTJUZ3VZYUJ2eGlWWllYbFh1RGtqVTA1aUtNWWRpQmNGcDgKOHQ0RkRGUFVNUkdnTU5XcElEeEdPZUN4TjB2OG90dDNPQmtGSHlva0dkeE12dTFxNUtWUzRZNjBEOFVnQy80aQpJR0UzUUNMcUl6WitqbTBvOHZBcWdKRy9yQUw1VW11ZlIrS25XZElJVmZIeWhad3hGald1dXJmUFp3S1gyM2FqCmdjSURGalBmMVhkZVdkRVZpQ0dBRGVhaVlmeXJDazVFK0k3eDM4WmoxZUhxbGpKWWg2bzJqYUtKeEhzSDBaSksKdXdJREFRQUIKLS0tLS1FTkQgUFVCTElDIEtFWS0tLS0tCg==

-----BEGIN ENCRYPTED PRIVATE KEY-----
MIIFLTBXBgkqhkiG9w0BBQ0wSjApBgkqhkiG9w0BBQwwHAQIcWh6z9EMYM0CAggA
MAwGCCqGSIb3DQIJBQAwHQYJYIZIAWUDBAEqBBBqOpXbx71NJZBKMR/68q72BIIE
0HVBN0ufwa3UrYO/J+KDVtvYAV4HkZ3RBP9D6DKutPK92wT6CiOB8wcfSj1dEEgl
FHZNDh7fMhKnm68SZyYuCV69dmZBMDLg5PqEtjvwQ1J5ppMCnDgLKriYI4mPfhrC
g8Ogfogus9fcS5/tynV+VdDAtVXnU5WV6GnQ711CHQttzgNZMF8fel5ymXix8kEA
WnSt2pAWXrGNCtBw8/8XfQ1gz4LhzqcWGxMsZ1GoQQETT4LpsTY7misJU8hSEPij
UyQL1Yp0jDIpnIBNrL0cQuqiyLN2FDKF/DAjxWTeJsma1ykq528qXwJ543h9AsQJ
UVh9aemfPE2R29EO6s/jqZTgoIX2KS6Jg8Bag8PrrkYQBzwECNjiBEiJccH+bDzH
VvKwCw2gnMX2jnJ57YTrCqpz1QdL1ennvtJUMHjNwa3PAA8PYMGjvR72d8tF2neS
kR64PKbBQjKdcuGpK4yPHsA3xQ2hnB/Ubi26JW2QB1FrBMsVynksfP0YKZWp4ssQ
f8k2riid9puvOuDyu8u0Vn6lvEOf91v9Cl85GeSbg3L6PJ/HLSRYrSfrOmm/oSA1
HXHJbh7h8C6XnYxc6ktJymx44WO6qdHo8rATzXsAJhbXz/vWhJd77D2tTN+R3M3n
9LBeQzOqf2AWeLVYFtRvQ5UOG39ln5ZbYVI838Zi7FcjLQSaH4JnjRlnKez1uD8K
ppukUVaYf/RxIGvBpPd+DB+yzrg4UAVzmy59n7L91IlfnqAhY5wfSFBxCfRcWExA
YbVe6v93+ucgDOjxwrQzTkim2BSFHe0B+iuUhJCkfV4vmbMUGaiCwi6rqsSlvpe1
BBXEHmN05CphH0KITC4rhKAxsbDi5wvsXYRxitjtNkaAFBz98uxIznmJJesoUBlw
kensqow3hiKmSyj6QbwgycRTEvBohx6/vBW4KpFZRiZ5OfCD5vBTgyaAjHx+DfYv
6rCfiGtuHLBt19fKMAzFHit4Y1lFO5tzcMIBzhHtctTNp7mHU/lfEkTbGaRX1KwA
z1iPSiC1Bo2UPs4nuYxWYxJiXDXZWl+9aVKghJZZrbJR1r/G92FTHpsIua0fg03U
9bYHDYcN3vuKnXpInROLFmhcH+9gx9wYFLIOB/KkdRow+cLrY46YL5TvAAXXnfhB
sy/sLQp8jhV4M84TJKKX6bcweElK5CjBiVa803nHZtIGzscyQofx05z1VXuH+VDs
/kXfMmEzvuEGB+kw1ool2Os0vCqlWhhC9RMpx+4kliTnHklMaqjEshWBYhUUwhm+
Ajz33YU1NwmezChCDbLnBy1xAYGW9MkFS4bbfVJszq4Xb7EbX5+SASczsdSpfosu
/Bqkf5+LssOoAQjXDyqBlouapjm42Y6Nix9wdd857N10us+/jGurKxlRu9QlXN+C
wCeRS6iziOmwxIYFWngIfgplZ03UulD5+CjMMBEuyvwZtgeFLRLINyfpaotdAGq1
WlUtQTobiadOwVCoSWC8JI0lE0HELbR34rPgC+rMAy0vrZdwAr+7uijsZNLwgdAV
OinFzij2tlyj7A7pmP+KPNsfbVgo2l34vIJyR8NGGhpY5FKxbuXdzAgK3oLENTHY
7XkOmhjGgctN3IrlVfizEyl2dYXB6wTUVNkIFW9OyA7E
-----END ENCRYPTED PRIVATE KEY-----

Base64 encoded pem:
LS0tLS1CRUdJTiBFTkNSWVBURUQgUFJJVkFURSBLRVktLS0tLQpNSUlGTFRCWEJna3Foa2lHOXcwQkJRMHdTakFwQmdrcWhraUc5dzBCQlF3d0hBUUljV2g2ejlFTVlNMENBZ2dBCk1Bd0dDQ3FHU0liM0RRSUpCUUF3SFFZSllJWklBV1VEQkFFcUJCQnFPcFhieDcxTkpaQktNUi82OHE3MkJJSUUKMEhWQk4wdWZ3YTNVcllPL0orS0RWdHZZQVY0SGtaM1JCUDlENkRLdXRQSzkyd1Q2Q2lPQjh3Y2ZTajFkRUVnbApGSFpORGg3Zk1oS25tNjhTWnlZdUNWNjlkbVpCTURMZzVQcUV0anZ3UTFKNXBwTUNuRGdMS3JpWUk0bVBmaHJDCmc4T2dmb2d1czlmY1M1L3R5blYrVmREQXRWWG5VNVdWNkduUTcxMUNIUXR0emdOWk1GOGZlbDV5bVhpeDhrRUEKV25TdDJwQVdYckdOQ3RCdzgvOFhmUTFnejRMaHpxY1dHeE1zWjFHb1FRRVRUNExwc1RZN21pc0pVOGhTRVBpagpVeVFMMVlwMGpESXBuSUJOckwwY1F1cWl5TE4yRkRLRi9EQWp4V1RlSnNtYTF5a3E1MjhxWHdKNTQzaDlBc1FKClVWaDlhZW1mUEUyUjI5RU82cy9qcVpUZ29JWDJLUzZKZzhCYWc4UHJya1lRQnp3RUNOamlCRWlKY2NIK2JEekgKVnZLd0N3MmduTVgyam5KNTdZVHJDcXB6MVFkTDFlbm52dEpVTUhqTndhM1BBQThQWU1HanZSNzJkOHRGMm5lUwprUjY0UEtiQlFqS2RjdUdwSzR5UEhzQTN4UTJobkIvVWJpMjZKVzJRQjFGckJNc1Z5bmtzZlAwWUtaV3A0c3NRCmY4azJyaWlkOXB1dk91RHl1OHUwVm42bHZFT2Y5MXY5Q2w4NUdlU2JnM0w2UEovSExTUllyU2ZyT21tL29TQTEKSFhISmJoN2g4QzZYbll4YzZrdEp5bXg0NFdPNnFkSG84ckFUelhzQUpoYlh6L3ZXaEpkNzdEMnRUTitSM00zbgo5TEJlUXpPcWYyQVdlTFZZRnRSdlE1VU9HMzlsbjVaYllWSTgzOFppN0ZjakxRU2FINEpualJsbktlejF1RDhLCnBwdWtVVmFZZi9SeElHdkJwUGQrREIreXpyZzRVQVZ6bXk1OW43TDkxSWxmbnFBaFk1d2ZTRkJ4Q2ZSY1dFeEEKWWJWZTZ2OTMrdWNnRE9qeHdyUXpUa2ltMkJTRkhlMEIraXVVaEpDa2ZWNHZtYk1VR2FpQ3dpNnJxc1NsdnBlMQpCQlhFSG1OMDVDcGhIMEtJVEM0cmhLQXhzYkRpNXd2c1hZUnhpdGp0TmthQUZCejk4dXhJem5tSkplc29VQmx3CmtlbnNxb3czaGlLbVN5ajZRYndneWNSVEV2Qm9oeDYvdkJXNEtwRlpSaVo1T2ZDRDV2QlRneWFBakh4K0RmWXYKNnJDZmlHdHVITEJ0MTlmS01BekZIaXQ0WTFsRk81dHpjTUlCemhIdGN0VE5wN21IVS9sZkVrVGJHYVJYMUt3QQp6MWlQU2lDMUJvMlVQczRudVl4V1l4SmlYRFhaV2wrOWFWS2doSlpacmJKUjFyL0c5MkZUSHBzSXVhMGZnMDNVCjliWUhEWWNOM3Z1S25YcEluUk9MRm1oY0grOWd4OXdZRkxJT0IvS2tkUm93K2NMclk0NllMNVR2QUFYWG5maEIKc3kvc0xRcDhqaFY0TTg0VEpLS1g2YmN3ZUVsSzVDakJpVmE4MDNuSFp0SUd6c2N5UW9meDA1ejFWWHVIK1ZEcwova1hmTW1FenZ1RUdCK2t3MW9vbDJPczB2Q3FsV2hoQzlSTXB4KzRrbGlUbkhrbE1hcWpFc2hXQlloVVV3aG0rCkFqejMzWVUxTndtZXpDaENEYkxuQnkxeEFZR1c5TWtGUzRiYmZWSnN6cTRYYjdFYlg1K1NBU2N6c2RTcGZvc3UKL0Jxa2Y1K0xzc09vQVFqWER5cUJsb3VhcGptNDJZNk5peDl3ZGQ4NTdOMTB1cysvakd1ckt4bFJ1OVFsWE4rQwp3Q2VSUzZpemlPbXd4SVlGV25nSWZncGxaMDNVdWxENStDak1NQkV1eXZ3WnRnZUZMUkxJTnlmcGFvdGRBR3ExCldsVXRRVG9iaWFkT3dWQ29TV0M4SkkwbEUwSEVMYlIzNHJQZ0Mrck1BeTB2clpkd0FyKzd1aWpzWk5Md2dkQVYKT2luRnppajJ0bHlqN0E3cG1QK0tQTnNmYlZnbzJsMzR2SUp5UjhOR0docFk1Rkt4YnVYZHpBZ0szb0xFTlRIWQo3WGtPbWhqR2djdE4zSXJsVmZpekV5bDJkWVhCNndUVVZOa0lGVzlPeUE3RQotLS0tLUVORCBFTkNSWVBURUQgUFJJVkFURSBLRVktLS0tLQo=

## Controllers

Controllers inputs are mapped to semantically meaningful buttons and sticks:

### Buttons

* Trigger
* Grip
* Menu
* Left
* Right
* Up
* Down

### Sticks

* Translate
* Rotate

## Tools

Terms:

* Point - Entity is pointed by laser pointer.
* Hover - Entity is intersected or pointed by controller.

### Movement Tool

### Entity Tool

* Grip Down - If entity hovered then hold else spawn and hold.
* Grip Up - Release hold entity.
* Trigger Down - Start laser pointer.
* Trigger Up - Stop laser pointer.

* Point - Increasing haptic feedback when entity is pointed until deleted after 3 seconds.

## Publish package

### First publish

---
    npm publish --access public
---

### Update

---
    npm version patch
    npm publish
---
