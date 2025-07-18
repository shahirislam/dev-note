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
    The AI-powered features require a Google Gemini API key.
    *   Go to the [Google AI Studio](https://aistudio.google.com/app/apikey) to get your free API key.
    *   Once the application is running, navigate to the "Settings" page.
    *   Enter your API key in the designated field and save. The key will be stored securely in your browser's local storage.

4.  **Run the development server:**
    ```bash
    pnpm dev
    ```
    Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Deployment

This project is designed to be deployed on any platform that supports Next.js (e.g., Vercel, Netlify). Since all data, including the API key, is stored client-side in local storage, no special environment variables are needed for the AI features to work upon deployment.

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

## Project Structure

A brief overview of the key directories in this project:

-   `src/app`: Contains the main pages and routing for the application.
-   `src/components`: Reusable React components used throughout the application.
-   `src/contexts`: React context providers for managing global state (e.g., data, theme).
-   `src/ai`: All AI-related logic, including Genkit flows and schemas.
-   `src/lib`: Utility functions and type definitions.

## Contributing

We welcome contributions from the community! To contribute, please follow these steps:

1.  **Fork the repository.**
2.  **Create a new branch** for your feature or bug fix: `git checkout -b feature/your-feature-name`.
3.  **Make your changes** and commit them with clear, descriptive messages.
4.  **Push your changes** to your fork.
5.  **Open a pull request** to the `main` branch of this repository.

Please also read our [Code of Conduct](CODE_OF_CONDUCT.md) and ensure your contributions adhere to it.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
