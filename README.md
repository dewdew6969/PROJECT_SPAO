# Sparo App (React Native Frontend)

Aplikasi Sparo ini dibangun menggunakan framework **React Native** (dengan Expo) untuk keperluan frontend. Struktur aplikasi sudah digenerate dan siap untuk dikembangkan lebih lanjut.

## Struktur Direktori Utama

- `assets/` - Berisi file gambar, font, dan aset statis lainnya.
- `app/` atau `src/` - (Bisa Anda buat) untuk menaruh komponen, screen, dan navigasi.
- `App.js` - Titik masuk (entry point) utama aplikasi React Native.
- `app.json` - Konfigurasi proyek Expo dan React Native.

---

## 📝 ERP Vibe Code

> Silakan tempel / tulis kode atau catatan terkait "ERP Vibe" Anda di bagian bawah ini.

```javascript
ERP PROMPT SPARO
Project Name

SPARO – Smart Sparring Matchmaking Platform

Project Overview

SPARO adalah aplikasi mobile berbasis Android dan iOS yang berfungsi untuk mempertemukan pemain olahraga dengan lawan sparing yang memiliki kemampuan setara menggunakan sistem ELO Rating, statistik pertandingan, jadwal bermain, lokasi, sportsmanship score, trust score, dan AI matchmaking.

Aplikasi ini memungkinkan pengguna mencari lawan olahraga secara otomatis tanpa admin, melakukan challenge pertandingan, memvalidasi hasil pertandingan, memperbarui rating secara otomatis, serta membangun komunitas olahraga yang kompetitif dan adil.

Target Platform
Mobile Android
Mobile iOS

Framework:

React Native
Expo

Backend:

FastAPI (Python)

Database:

MySQL

Authentication:

Firebase Authentication

Maps:

Google Maps API

AI Engine:

Python
TensorFlow
Scikit Learn

Storage:

Firebase Storage

Notification:

Firebase Cloud Messaging
Supported Sports
Badminton
Futsal
Basket
Voli
Tennis
Tennis Meja
Mini Soccer
Padel
Catur
User Role
1. Player/User

Dapat:

Registrasi
Login
Melengkapi profil
Memilih olahraga
Mencari lawan
Membuat challenge
Mengikuti challenge
Menginput hasil pertandingan
Melihat statistik
Melihat ranking
Mengikuti turnamen
Membuat turnamen

Tidak ada admin operasional.

Semua proses berjalan otomatis.

Authentication Module
Register

Field:

Full Name
Email
Phone Number
Password
Confirm Password

Validation:

Email Verification
OTP Verification
Login

Field:

Email
Password

Support:

Google Login
Apple Login
Profile Module

Field:

Profile Picture
Full Name
Username
Gender
Date of Birth
Height
Weight
City
Province

Sports Information:

Primary Sport
Secondary Sport

Availability:

Available Days
Available Time
Sports Profile Module

Setiap olahraga memiliki:

Rating
Level
Match Count
Win Count
Lose Count
Draw Count
Win Rate

Contoh:

Badminton:

Rating: 1000

Level: Beginner

Dashboard

Menampilkan:

Profile Summary
Profile Picture
Name
Rating
Level
Statistics
Total Match
Win
Lose
Draw
Win Rate
Recommended Opponent

AI Match Recommendation

Upcoming Match

Menampilkan jadwal pertandingan berikutnya.

ELO Rating System

Initial Rating:

1000

Formula:

Rnew = Rold + K(S-E)

Expected Score:

E = 1 / (1 + 10^((OpponentRating - PlayerRating)/400))

K Factor:

Placement Match = 40

Regular Player = 32

Experienced Player = 24

Elite Player = 16

Placement Match

User baru wajib menyelesaikan:

5 pertandingan

Status:

Placement Match 1/5

Placement Match 2/5

Placement Match 3/5

Placement Match 4/5

Placement Match 5/5

Setelah selesai:

Masuk leaderboard resmi.

Find Opponent Module

Filter:

Sport
Rating
Distance
Gender
Age
Day
Time

Display:

Profile Picture
Name
Rating
Level
Distance
Sportsmanship Score

Button:

View Profile
Challenge
Challenge Module

User dapat membuat challenge.

Field:

Opponent
Date
Time
Location
Sport

Status:

Pending
Accepted
Rejected
Completed
Match Verification System

Tidak menggunakan admin.

Step 1

Kedua pemain melakukan:

GPS Check In

Valid jika berada dalam radius lokasi pertandingan.

Step 2

Setelah pertandingan:

Pemain A menginput:

Score
Winner
Step 3

Pemain B melakukan konfirmasi.

Pilihan:

Agree
Disagree
Step 4

Jika hasil sama:

Status:

Verified

Rating otomatis diperbarui.

Step 5

Jika hasil berbeda:

Status:

Conflict Detected

Sistem meminta:

Upload Scoreboard Photo

OCR Verification

AI membaca hasil skor menggunakan OCR.

Jika hasil valid:

Status:

Verified

Jika tidak valid:

Status:

Rejected

Trust Score System

Nilai awal:

100

Rule:

Match Verified:

+1

Conflict Result:

-3

No Show:

-5

Fraud Detected:

-10

Range:

0-100

Sportsmanship Score

Dinilai setelah pertandingan.

Kategori:

Fair Play
Attitude
Communication
Punctuality

Rating:

1-5 Stars

AI Match Recommendation

AI mempertimbangkan:

Rating
Win Rate
Sportsmanship
Trust Score
Location
Availability

Output:

Match Compatibility Score

Contoh:

95% Compatible

Anti Fraud System

Deteksi:

Rating Farming
Fake Match
Multi Account
Repeated Opponent Abuse

Rule:

Maksimal 3 pertandingan dengan lawan yang sama dalam 7 hari untuk perhitungan rating.

Leaderboard Module

Kategori:

City
Province
National

Ranking berdasarkan:

Rating
Win Rate
Match Count
Tournament Module

User dapat membuat turnamen.

Field:

Tournament Name
Sport
Date
Location
Maximum Participant

Sistem otomatis membuat:

Bracket
Match Schedule
Ranking
Community Module

Fitur:

Posting
Comment
Like
Share
Find Training Partner
Notification Module

Push Notification:

Challenge Received
Challenge Accepted
Match Reminder
Result Verified
Rating Updated
Database Structure

Users

id
fullname
username
email
phone
password
created_at

Profiles

id
user_id
photo
gender
birthdate
height
weight
city
province

Sports

id
sport_name

Ratings

id
user_id
sport_id
rating
level

Matches

id
player1_id
player2_id
winner_id
score
status

Challenges

id
sender_id
receiver_id
date
time
location

TrustScores

id
user_id
score

Sportsmanship

id
user_id
score

Tournaments

id
name
sport_id
date

Posts

id
user_id
content

Comments

id
post_id
user_id
comment

Notifications

id
user_id
title
body
```

---

## Menjalankan Aplikasi

Untuk menjalankan aplikasi ini secara lokal pada mode development:

1. Pastikan Anda berada di direktori proyek:

   ```bash
   cd c:\xampp82\htdocs\sparo
   ```
2. Jalankan perintah berikut:

   ```bash
   npm start
   ```

   Atau untuk langsung membuka di Android/Web:
   ```bash
   npm run android
   npm run web
   ```

## Info Tambahan

- Pastikan Anda sudah menginstal aplikasi **Expo Go** di HP Anda (Android/iOS) jika ingin melihat hasil render aplikasi secara langsung dengan memindai QR Code.
- Untuk menginstall dependency tambahan, Anda bisa menggunakan `npm install <nama-paket>`.
