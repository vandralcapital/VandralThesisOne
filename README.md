# SlideWise

SlideWise is an AI-powered presentation generator that helps you create beautiful, professional presentations in minutes. With features like AI content generation, customizable templates, and smart slide layouts, SlideWise streamlines the process of building impactful presentations for any purpose.

## Features
- **AI Content Generation:** Instantly generate slide content from a simple prompt.
- **Customizable Templates:** Choose from a variety of professionally designed templates.
- **Smart Slide Layouts:** AI arranges your content for optimal readability and visual appeal.
- **Collaborative Workspaces:** Invite team members to collaborate on presentations.
- **Export as PDF:** Download your presentations for offline use or sharing.
- **Modern, Intuitive UI:** Clean, distraction-free interface for easy editing and navigation.

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (local or cloud instance)

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd ThesisOne
```

### 2. Backend Setup
```bash
cd backend
npm install
```

- Create a `.env` file in the `backend` directory with the following variables:
  ```env
  MONGO_URI=<your-mongodb-connection-string>
  JWT_SECRET=<your-jwt-secret>
  PORT=5001
  ```
- Start the backend server:
  ```bash
  npm start
  ```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm start
```
- The frontend will run on [http://localhost:3000](http://localhost:3000)

## Usage
1. **Sign Up:** Create a new account to start your 30-day free trial.
2. **Create Presentations:** Use the "Generate with AI" option to create presentations from a prompt.
3. **Edit Slides:** Click on slide or presentation names to rename, edit content, and customize backgrounds.
4. **Collaborate:** Invite team members to your workspace from the settings modal.
5. **Export:** Download your presentation as a PDF for sharing or offline use.

## Project Structure
```
ThesisOne/
  backend/      # Node.js/Express/MongoDB backend
  frontend/     # React frontend
```

## Support & Contact
- For issues or feature requests, please open an issue in this repository.
- For direct support, contact the maintainer at [your-email@example.com].

---
Enjoy creating stunning presentations with SlideWise! 