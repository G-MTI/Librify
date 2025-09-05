# Librify

Librify is a web application designed to help users search for books, scan ISBN codes, and build a personal library directly in the browser. The project aims to provide a simple, intuitive, and interactive experience for anyone who wants to organize and keep track of books they are interested in.

Features
- Text-based book search: Users can search for books by title, author, or ISBN using the Open Library API.
- ISBN scanner: Users can scan physical book barcodes using their device camera to quickly retrieve book information.
- Personal library: Users can add books from search results to their own library, which is stored in localStorage for persistence across sessions.
- Interactive UI: Each book in the library can be removed individually, with live updates reflected in the interface.
- Input sanitization: All text inserted into the DOM is sanitized using a custom escapeHtml function to prevent potential attacks.

How It Works
- Search for books: The user types a query into the search input. JavaScript calls the Open Library API using fetch, filters results with available cover images, and displays the top results.
- Scan ISBN codes: The user can activate the camera using the html5-qrcode library. When a barcode is scanned, the ISBN is extracted, validated, and used to fetch book data from the Open Library API.
- Manage personal library: Users can add books to their library by clicking the "add" button. The book is saved in localStorage, preventing duplicates. Books can be removed using the "delete" button.


I created this website entirely from scratch. I designed the user interface, made the background image with Copilot, built the functionality using JavaScript, and styled it with CSS. 
The project uses external libraries and APIs: [Open Library API](https://openlibrary.org/developers/api)I for book data and [html5-qrcode](https://github.com/mebjas/html5-qrcode) for barcode scanning.

For now, the data collected by users is saved in the browser's localStorage. In the future, I plan to implement an account system so users can save their library online and access it across devices.


This project taught me a lot about:
- Asynchronous JavaScript (async/await, fetch)
- DOM manipulation and event handling
- Working with browser APIs like localStorage and the camera
  
[![Athena Award Badge](https://img.shields.io/endpoint?url=https%3A%2F%2Faward.athena.hackclub.com%2Fapi%2Fbadge)](https://award.athena.hackclub.com?utm_source=readme)
