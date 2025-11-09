# 🧡 Orange Sulphur

**Orange Sulphur** is a **web-based platform** developed as part of the **SER598 Advanced Web Project (Final)**.
The project serves as an **online store for buying and learning about organic fruits and vegetables**, emphasizing **accessibility, nutrition awareness, and inclusivity** for all users.

---

## 🌱 Overview

Orange Sulphur allows users to:

* Explore and purchase **organic fruits and vegetables**.
* Browse products by **diverse food categories**.
* Learn **nutritional values** and **vitamin facts** about each item.
* Discover **recipes** created using fruits and vegetables through an integrated **Recipe API**.
* Experience a **modern, accessible web interface** designed for users with various abilities and needs.

---

## 🎯 Acceptance Criteria

* ✅ Website serves as an **Online Organic Store**.
* ✅ Displays **food categories**, **nutritional data**, and **vitamin facts**.
* ✅ Implements **Recipe Search Integration** using a Recipe API.
* ✅ Provides **modern accessibility features**:

  * Support for **digital on-screen keyboard**.
  * **Audio narration** and **text-to-speech** features.
  * **Color blindness–friendly palette** and **high-contrast mode**.
  * **Font size adjustments** for readability.
  * **ARIA compliance** for assistive technologies (screen readers).
  * **Keyboard navigation** and **focus visibility**.
  * **Reduced motion / dyslexia-friendly font options**.
  * A **mode toggle button** in the navigation bar allows users to enable or switch between accessibility modes.

---

## 🏗️ Tech Stack

| Category                | Technology                                              |
| ----------------------- | ------------------------------------------------------- |
| **Frontend**            | React 19 (Vite), TypeScript                             |
| **Styling**             | TailwindCSS, CSS Modules                                |
| **State Management**    | Redux Toolkit                                           |
| **API Integration**     | REST / Recipe API                                       |
| **Accessibility Tools** | ARIA Attributes, WAI-ARIA Guidelines, VoiceOver Testing |
| **Build Tool**          | Vite                                                    |
| **Version Control**     | Git / GitHub                                            |

---

## 🧩 Features

* 🛒 **Organic Storefront** – Shop fruits & vegetables with clear labeling.
* 🧠 **Nutrition Insights** – Understand what you consume via detailed nutrition facts.
* 🍳 **Recipe Finder** – Fetch and explore recipes using fruits and vegetables.
* ♿ **Accessibility Suite** – Inclusive support for vision, hearing, and motor impairments.
* 🌗 **Dynamic Mode Switch** – Toggle between standard and accessibility-enhanced modes.
* 🔍 **Search & Filter** – Quickly find items by category, name, or nutrition type.
* 💬 **Voice Assistance (Planned)** – Integrated voice command and feedback system.

---

## 🧭 Folder Structure (Frontend)

```
src/
├── assets/              # Images, icons, and static resources
├── components/          # Reusable UI components (Navbar, Footer, Buttons, etc.)
├── pages/               # Page-level components (Home, Store, Recipes, etc.)
├── hooks/               # Custom React hooks
├── context/             # Global context providers
├── redux/               # Redux Toolkit slices and store setup
├── utils/               # Helper functions and constants
├── services/            # API integration and data fetching
├── styles/              # Global CSS or Tailwind configuration
└── App.tsx              # Root component
```

---

## ⚙️ Getting Started

### 1️⃣ Clone the repository

```bash
git clone https://github.com/<your-org>/OrangeSulphur.git
cd SER985-Group2-MA-
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Run the development server

```bash
npm run dev
```

### 4️⃣ Build for production

```bash
npm run build
```

---

## 🌍 Accessibility Goals (A11y)

Orange Sulphur aims to comply with:

* **WAI-ARIA 1.2**
* **WCAG 2.1 AA** Standards
* Inclusive design principles for:

  * Visual disabilities (color blindness, low vision)
  * Hearing impairments
  * Cognitive and learning disabilities
  * Motor and mobility limitations

---

## 📡 APIs Used

* **Recipe API** for fetching fruit/vegetable-based recipes.
* **(Planned)**: Additional open food/nutrition databases.

---

## 🧠 Future Enhancements

* Integration with **voice assistant commands**.
* **User authentication** and profile management.
* **Cart and payment** integration.
* **Machine learning recommendations** for recipes and nutrition plans.
* **Dark mode** and **auto-accessibility detection**.

---

## 👩‍💻 Contributors

* **Team Orange Sulphur (SER598 Group 2)**

  * Ritik Zambre - rzambre
  * [Team Member 2]
  * [Team Member 3]
  * [Team Member 4]

---

## 📜 License

This project is licensed under the **MIT License** – see the [LICENSE](./LICENSE) file for details.

---

