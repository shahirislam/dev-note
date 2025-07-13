# DevDiary - Project & Task Tracker

A simple, clean website to help a solo software developer keep track of projects, project-specific tasks, and small notes. Includes AI-powered note generation.

## Features

*   **Project Management:** Organize your work into distinct projects.
*   **Task Tracking:** Create and manage tasks within each project, with due dates and completion status.
*   **Note Taking:** Add project-specific notes to keep track of ideas, meeting summaries, or code snippets.
*   **AI Note Generation:** Leverage Google Gemini AI to generate notes based on prompts and existing context.
*   **Data Persistence:** All your data is stored securely in your browser's local storage.
*   **Data Export/Import:** Easily back up your data or transfer it between devices.
*   **Responsive Design:** Works well on various screen sizes.
*   **Dark Mode:** Toggle between light and dark themes.

## Setup and Local Development

To run this project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/shahirislam/dev-note.git
    cd dev-note
    ```

2.  **Install dependencies:**
    This project uses `pnpm`. If you don't have `pnpm` installed, you can install it via npm: `npm install -g pnpm`.
    Then, install the project dependencies:
    ```bash
    pnpm install
    ```

3.  **Configure Google Gemini API Key:**
    For the AI note generation feature to work, you need a Google Gemini API key.
    *   Go to the [Google AI Studio](https://aistudio.google.com/app/apikey) to get your API key.
    *   Create a `.env.local` file in the root of your project (if it doesn't exist) and add your API key:
        ```
        GEMINI_API_KEY=YOUR_GEMINI_API_KEY
        ```
        Replace `YOUR_GEMINI_API_KEY` with your actual key.

4.  **Run the development server:**
    ```bash
    pnpm dev
    ```
    Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Deployment

This project can be deployed to platforms like Vercel, Netlify, or others that support Next.js applications.

**Important for AI Features in Deployment:**

When deploying, you **must** set the `GEMINI_API_KEY` (or `GOOGLE_API_KEY`) environment variable in your deployment platform's settings. This is crucial for the server-side AI generation to function correctly. The value should be your Google Gemini API key.

*   **Example (Vercel):** Go to your project settings, navigate to "Environment Variables," and add `GEMINI_API_KEY` with your key as the value.

## Technologies Used

*   Next.js
*   React
*   TypeScript
*   Tailwind CSS
*   Shadcn/ui
*   Genkit (for AI integration)
*   Google Gemini API
*   Zod (for schema validation)
*   date-fns (for date manipulation)
*   pnpm (package manager)

## Contributing

Contributions are welcome! Please feel free to open issues or submit pull requests.

## License

[Specify your license here, e.g., MIT License]
