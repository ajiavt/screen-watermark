# Screen Watermark Application

## Downloads

- 🍎 for mac: https://drive.google.com/file/d/1iO6sabXpZ1B8lwrf0SpuagNiAZ4Oj5cP/view?usp=sharing
- 🪟 for win: https://drive.google.com/file/d/1GxxuhHYzcYmiw137kPpdKyP3vYu8efK5/view?usp=sharing

## Tutorial Video: How to Use the App

- https://www.canva.com/design/DAGp6r-v0PU/aN1XEDZlIXSK1j41jv2Lkg/watch?utm_content=DAGp6r-v0PU&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=hf0e146ca6f

## Introduction

The Screen Watermark Application is a cross-platform desktop application (macOS and Windows) that allows users to display an image as a floating watermark over all other windows. Users can select an image, set its position, opacity, and size. The application is built using Electron, HTML, CSS, and JavaScript.

## Key Features

-   **Image Selection**: Users can select an image file (e.g., PNG, JPG) from their file system to use as the watermark.
-   **Overlay Display**: The watermark is displayed as a transparent, always-on-top window.
-   **Opacity Adjustment**: Users can control the transparency level of the watermark.
-   **Drag-and-Drop**: The watermark can be moved to any position on the screen by dragging it.
-   **Resizing**: The size of the watermark can be adjusted as needed.
-   **Close Button**: The watermark can be easily closed using an 'x' button.
-   **Settings Persistence**: The application saves the last used image, position, size, and opacity, so these settings are reloaded on the next launch.

## Prerequisites

Before you can run or build this application from the source code, you need to have the following software installed:

-   **Node.js and npm**: Electron and its dependencies are managed via npm (Node Package Manager), which is included with Node.js. You can download Node.js from [https://nodejs.org/](https://nodejs.org/).
-   **Git**: (Optional, if you are cloning the repository) You can download Git from [https://git-scm.com/](https://git-scm.com/).

## Installation and Running from Source

1.  **Clone the Repository (if applicable) or Download Source Code:**
    ```bash
    git clone <YOUR_REPOSITORY_URL>
    cd screen-watermark
    ```
    If you have the project files directly, navigate to the project directory.

2.  **Install Dependencies:**
    Open a terminal or command prompt in the project's root directory and run the following command to install all dependencies listed in `package.json`:
    ```bash
    npm install
    ```

3.  **Run the Application in Development Mode:**
    Once the dependencies are installed, you can run the application with the command:
    ```bash
    npm start
    ```
    This will launch the watermark application.

## Building the Application (Creating Executables)

The application uses `@electron/packager` to create distributable executable files for macOS and Windows.

1.  **For macOS (from macOS):**
    Run the following command in your terminal:
    ```bash
    npm run package-mac
    ```
    This will create the application in `.app` format inside the `release-builds/screen-watermark-darwin-x64/` directory.

2.  **For Windows (from macOS or Windows):**
    Run the following command in your terminal:
    ```bash
    npm run package-win
    ```
    This will create the application in `.exe` format along with its supporting files inside the `release-builds/screen-watermark-win32-ia32/` (for 32-bit architecture) or `release-builds/screen-watermark-win32-x64/` (if configured for 64-bit).

    *Note for building Windows from macOS/Linux*: `@electron/packager` may require Wine to package some Windows resources. If you encounter issues, ensure Wine (specifically `wine64`) is installed and configured correctly on your system.

## Project Structure

Here is an overview of the main files and directories in this project:

-   `package.json`: The Node.js project configuration file. It defines project metadata, dependencies, and npm scripts (e.g., `start`, `package-mac`, `package-win`).
-   `package-lock.json`: Records the exact versions of each installed dependency.
-   `main.js`: The main entry point for the Electron main process. Responsible for creating the browser window, handling system events, and communicating with the renderer process.
-   `preload.js`: A script that runs before the web page is loaded in the Electron browser window. Used to securely expose specific Node.js or Electron APIs to the renderer process via `contextBridge`.
-   `index.html`: The HTML file that defines the user interface (UI) structure for the watermark window.
-   `style.css`: The CSS file that defines the visual styles for the elements in `index.html`.
-   `renderer.js`: The JavaScript script that runs in the renderer process (inside the browser window). Responsible for handling UI logic, user interactions (e.g., image selection, opacity adjustment, drag, resize), and communicating with the main process via the APIs exposed by `preload.js`.
-   `node_modules/`: The directory where npm installs all project dependencies.
-   `release-builds/`: The directory where the build output (executable applications) will be placed after running the `package-mac` or `package-win` scripts.

## How to Use the Application

1.  **Run the Application**:
    -   If running from source: `npm start`.
    -   If you have the executable: Run the `.app` (macOS) or `.exe` (Windows) file.

2.  **Select Watermark Image**:
    -   When the application is first run or if no image is saved, you will be prompted to select an image file.
    -   Click the "Select Image" button to open the file dialog and choose the image you want to use as the watermark.

3.  **Adjust the Watermark**:
    -   **Move**: Click and drag the watermark image to move it to your desired position on the screen.
    -   **Resize**: Click and drag the resize handle (usually in the bottom-right corner of the watermark) to change its size.
    -   **Adjust Opacity**: Use the opacity slider to control the transparency of the watermark.

4.  **Close the Watermark**:
    -   Click the 'x' button (usually in the top-right corner of the watermark) to close the application.

Your last settings (image, position, size, opacity) will be saved and reloaded the next time you run the application.

## Contributing

If you would like to contribute to this project, please fork the repository and create a pull request with your changes.

## License

This project is licensed under the MIT License. Copyright (c) 2025 Aji Rama Wangsa.

