# RootSense AI: Intelligent Dental Diagnostic Platform

RootSense AI is a next-generation clinical intelligence platform designed to assist dental professionals and students with precise diagnostics, interactive simulations, and automated patient record management.

## 🌟 Key Features

- **Neural Vision Lab**: Advanced AI-powered pathology detection (Caries, Gingivitis, Calculus) using YOLOv8 architectures.
- **Interactive Simulation Engine**: High-fidelity WebGL-based dental simulations for clinical training.
- **Inference Simulator**: Real-time diagnostic testing environment with pattern verification.
- **Clinical Records Management**: Automated PDF report generation and secure patient data handling via Supabase.
- **Performance Analytics**: Comprehensive tracking of diagnostic accuracy and efficiency tiers.

## 🚀 Tech Stack

- **Frontend**: Next.js 15, Tailwind CSS, Framer Motion, Lucide React
- **Backend/Database**: Supabase (Auth, Storage, Database)
- **AI/ML**: Python, Ultralytics YOLOv8, PyTorch
- **Simulation**: Unity WebGL
- **Deployment**: Cloudflare Pages / Vercel

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+
- Python 3.9+ (for ML modules)
- Supabase Account

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-repo/rootsense-ai.git
   cd rootsense-ai
   ```

2. **Install Frontend Dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy the example environment file and fill in your Supabase credentials:
   ```bash
   cp .env.example .env.local
   ```
   *Note: Ensure `.env.local` is never committed to version control.*

4. **Run Development Server:**
   ```bash
   npm run dev
   ```

5. **ML Module Setup (Optional):**
   ```bash
   cd model
   pip install -r requirements.txt
   python train.py
   ```

## 📂 Project Structure

- `src/app`: Next.js App Router components and pages.
- `src/components`: Reusable UI components.
- `model/`: AI training scripts and pre-trained YOLO models.
- `public/unity_build`: Compiled Unity simulation assets.

## 📄 License

This project is proprietary and confidential.

---
*RootSense AI · Precision Lab v2.4*
