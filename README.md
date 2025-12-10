# EntropyPass 🔐

> **Engineering-Grade Password Generator & Security Suite**

EntropyPass is a modern, high-performance React application designed for generating cryptographically secure sequences and analyzing password strength using a hybrid approach: **Deterministic Mathematics** (Shannon Entropy) + **Semantic Intelligence** (Google Gemini AI).

Built with a "Cyber-Industrial" aesthetic, it prioritizes usability, data visualization, and deep security auditing.

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Made in Italy](https://img.shields.io/badge/made_in-Italy-green.svg)

## ✨ Key Features

### 1. The Generator (Utility)
A robust tool for creating credentials for any use case.
*   **Random Mode:** Highly configurable parametric generation (Length, Symbols, Numbers, Ambiguous characters exclusion).
*   **PIN Mode:** Secure numeric generation (4-8 digits) with "No Ambiguous" filtering.
*   **Smart AI Mode:** Generates *XKCD-style* memorable passphrases (e.g., "Correct Horse Battery Staple") based on a user-provided context (e.g., "Cyberpunk City" or "Italian Cuisine") using Google Gemini.
*   **NATO Phonetic Readout:** Visual breakdown of characters for over-the-phone clarity.

### 2. The Analyzer (Audit)
A dual-engine analysis dashboard.
*   **Deterministic Engine:** Calculates Shannon Entropy (bits), pool size, and estimates brute-force crack time based on supercomputer arrays (100 Trillion guesses/sec).
*   **Semantic Intelligence (AI):** Uses Google Gemini 2.5 Flash to audit the password for human patterns, keyboard walks (e.g., "qwerty"), dictionary words, and "1337" speak substitutions that mathematical entropy often misses.
*   **Visualizer:** Real-time visual feedback of entropy vs. AI security score.

## 🛠 Tech Stack

*   **Core:** React 19, TypeScript, Vite
*   **Styling:** Tailwind CSS (Custom "Engineering" Theme)
*   **AI Integration:** Google GenAI SDK (`@google/genai`)
*   **Visualization:** Recharts
*   **Icons:** Lucide React

## 🚀 Getting Started

### Prerequisites

*   Node.js (v18 or higher)
*   A Google AI Studio API Key (for AI features)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/entropypass.git
    cd entropypass
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure API Key**
    Create a `.env` file in the root directory (or configure your environment variables) with your Gemini API Key:
    ```env
    API_KEY=your_google_gemini_api_key_here
    ```

4.  **Run the application**
    ```bash
    npm start
    ```

## ⚠️ Security Disclaimer

**EntropyPass** is designed as a security tool.
*   **Client-Side Generation:** All random generation happens locally in your browser using `window.crypto`.
*   **AI Analysis:** When using the "Smart AI" generator or the "Deep Audit" analyzer, data is sent to Google's Gemini API. **Do not use the AI Analysis feature for real, active banking passwords.** Use it for auditing potential passwords or understanding security concepts.

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 👨‍💻 Author

**Riccardo Righini**
*   Made in Italy 🇮🇹

---

*Note: This project is for educational and utility purposes. Always use best practices when managing sensitive credentials.*