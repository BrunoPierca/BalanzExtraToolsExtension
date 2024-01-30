# Balanz Chrome Extension

## Usage

1. **Clone this repo**
   - Open your terminal and run:
     ```bash
     git clone https://github.com/BrunoPierca/BalanzExtraToolsExtension.git
     ```

2. **Navigate to Chrome Extensions**
   - Open Google Chrome and go to `chrome://extensions/`

3. **Load Unpacked Extension**
   - Click on "Load unpacked" and select the folder where you cloned the repository.

4. **Configure Extension**
   - Click on the extension icon in your browser.
   - Enter your username, and it will be saved into Chrome storage.

5. **Automate Login**
   - Visit the Balanz login page.
   - The script will automatically enter your username, and autocomplete handles the rest.

6. **Explore Portfolio**
   - Once inside the app, navigate to "app/mi-cartera."
   - If you've set your columns to display "Variación (%)":
     - You'll see the total movement of the stocks (right after the historic fluctuation cell).
     - An additional column shows the total movement of the day (quantity of stocks * price change).
