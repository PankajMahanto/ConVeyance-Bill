# 🚗 Conveyance Bill Tracker

A simple, responsive, and persistence-enabled web application for tracking daily transportation expenses, calculating total costs, and generating professional PDF and CSV reports.  
Perfect for personal use or quick expense logging that can be hosted on platforms like **GitHub Pages**.

# [LIVE LINK](https://pankajmahanto.github.io/ConVeyance-Bill/)
---

## 📋 Overview

This application functions as a **digital ledger** for your conveyance bills.  
It's built entirely within a **single HTML file**, utilizing **JavaScript** for logic and **Tailwind CSS** for a clean, mobile-first design.

All data is automatically saved in your browser, ensuring that your entries are preserved even if you close and reopen the tab.

---

## ✨ Features

- **Automatic Data Persistence:**  
  All entries are saved automatically to the browser’s Local Storage in real time.  
  You can close the browser and your data will still be there when you return.

- **Real-time Calculations:**  
  The total amount updates instantly as you add, edit, or remove entries.

- **Date-Wise Sorting:**  
  Entries are automatically sorted by date in descending order (newest at the top).

- **Full CRUD Functionality:**  
  Add, edit, and remove trip entries with ease.

- **Mobile-Ready Design:**  
  Fully responsive layout optimized for both desktop and mobile devices.

- **Report Downloads:**  
  - **Download as CSV:** Export all data to a spreadsheet-compatible `.csv` file. (Includes Excel date formatting fix.)  
  - **Download as PDF:** Generate a clean, print-ready PDF report for submission or records.

---

## 🚀 How to Run Locally

1. **Save the File:**  
   Download or copy the code into a file named `conveyance_tracker.html`.

2. **Open in Browser:**  
   Double-click the file. It will open instantly in your default browser (Chrome, Firefox, Edge, etc.).

3. **Start Tracking:**  
   Begin adding your conveyance bill entries.

---

## 🌐 Hosting on GitHub Pages

This single-file structure is perfect for **GitHub Pages**.

1. Create a new repository.
2. Upload the `conveyance_tracker.html` file.
3. Enable **GitHub Pages** in your repository settings.
4. Your app will be live and fully functional!

---

## 💾 Data Persistence and Storage

- **Automatic Save:** Data is saved automatically after every Add, Edit, or Remove action.  
- **Local Only:** Data is stored locally in your browser’s **Local Storage**.  
  - It is **not uploaded** to any server.  
  - Clearing browser data will delete your saved entries.  
  - Data does **not sync** across devices.

---

## 🛠️ Technology Stack

| Component      | Description                                                  |
|----------------|--------------------------------------------------------------|
| **HTML5**      | Structure and main container.                                |
| **Tailwind CSS** | Utility-first framework for responsive styling.             |
| **JavaScript** | Core logic, data management, and DOM manipulation.           |
| **LocalStorage** | Automatic, persistent client-side data storage.             |
| **jsPDF / autoTable** | External libraries for generating PDF reports.         |
| **CSV Generation** | Native JavaScript logic for creating downloadable CSV files. |

---

## 📄 License

This project is open source and available under the **MIT License**.

---

### 💡 Author
Developed with ❤️ for anyone who wants a simple, one-file solution for tracking daily conveyance expenses.
