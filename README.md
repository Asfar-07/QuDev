# qu.dev — Survey Database Design Tool

> A free, open-source web tool for developers to design and manage survey database schemas using Spring Boot and MySQL.

---

## 🚀 About

**qu.dev** is a developer-focused tool that lets you build, manage, and export survey database structures through a clean web interface. Built with Spring Boot and Thymeleaf, it gives developers full control over survey sections, question types, and user response data — all backed by a clean relational MySQL schema.

---
## 📸 Screenshots

<div align="center">
<table>
<tr>
<td><img src="./static/image/screenshot/screenshot-1.png" alt="Screenshot 1" width="100%"/></td>
<td><img src="./static/image/screenshot/screenshot-2.png" alt="Screenshot 2" width="100%"/></td>
</tr>
<tr>
<td><img src="./static/image/screenshot/screenshot-3.png" alt="Screenshot 3" width="100%"/></td>
<td><img src="./static/image/screenshot/screenshot-4.png" alt="Screenshot 4" width="100%"/></td>
</tr>
<tr>
<td><img src="./static/image/screenshot/screenshot-5.png" alt="Screenshot 5" width="100%"/></td>
<td><img src="./static/image/screenshot/screenshot-6.png" alt="Screenshot 6" width="100%"/></td>
</tr>
<tr>
<td><img src="./static/image/screenshot/screenshot-7.png" alt="Screenshot 7" width="100%"/></td>
</tr>
  <tr>
<td><img src="./static/image/screenshot/screenshot-8.png" alt="Screenshot 8" width="100%"/></td>
</tr>
</table>
</div>
## ✨ Features

- 📋 Create and manage **multiple survey sections**
- ❓ Add **different question types** per section
- 🖨️ **Print user responses** directly from the UI
- 🗃️ Developer-friendly **4+ table relational database** schema
- 🎨 Clean **Thymeleaf-based UI** with full CRUD support
- 🔓 **100% developer control** — no black-box logic

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Java, Spring Boot |
| Frontend | Thymeleaf, HTML, CSS, JavaScript |
| Database | MySQL |
| Build Tool | Maven |

---

## 📦 Getting Started

### Prerequisites

- Java 17+
- MySQL 8+
- Maven

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Asfar-07/qu.dev.git
cd qu.dev

# 2. Configure your database
# Edit src/main/resources/application.properties
spring.datasource.url=jdbc:mysql://localhost:3306/qudev
spring.datasource.username=YOUR_USERNAME
spring.datasource.password=YOUR_PASSWORD

# 3. Create the database
mysql -u root -p -e "CREATE DATABASE qudev;"

# 4. Run the application
./mvnw spring-boot:run
```

### Access

Open your browser and go to: `http://localhost:8080`

---

## 🗄️ Database Structure

```
surveys
├── sections       → Survey sections (groups of questions)
├── questions      → Questions linked to sections
├── options        → Answer options per question
└── responses      → Stored user responses
```

> The schema is designed to be simple, extendable, and easy to integrate into any Spring Boot project.

---

## 📖 How to Use

1. **Create a Survey** — Add a title and description
2. **Add Sections** — Group related questions under sections
3. **Add Questions** — Choose question types per section
4. **View Responses** — Browse and print user response data

---

## 📚 Documentation

Full documentation is available in the [`/docs`](https://github.com/Asfar-07/qu.dev/blob/main/qu.devTooldocumentation.pdf) folder, including:

- Setup guide
- Database schema explanation
- API & controller overview
- How to extend the tool

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

---


## 👤 Author

**Asfar Muhammed N S**
[GitHub](https://github.com/Asfar-07)
