const html5QrCode = new Html5Qrcode("reader");
const startBtn = document.getElementById("btn-start-scan");
const stopBtn = document.getElementById("btn-stop-scan");
const scanStatus = document.getElementById("scan-status");
startBtn.addEventListener("click", async () => {
  scanStatus.textContent = "Richiesta permesso fotocamera…";
  startBtn.disabled = true;

  const config = { 
    fps: 10, 
    qrbox: { width: 300, height: 120},
    formatsToSupport: [Html5QrcodeSupportedFormats.EAN_13]
 };
 
  try {
    // prova a usare la camera "environment" (posteriore)
    await html5QrCode.start(
      { facingMode: { exact: "environment" } }, 
      config,
      onScanSuccess,
      onScanFailure
    );
    scanStatus.textContent = "Scanner attivo: inquadra il codice a barre.";
    stopBtn.disabled = false;
  } catch (err) {
    // fallback se exact non è supportato su alcuni dispositivi
    try {
      await html5QrCode.start({ facingMode: "environment" }, config, onScanSuccess, onScanFailure);
      scanStatus.textContent = "Scanner attivo.";
      stopBtn.disabled = false;
    } catch (e) {
      console.error(e);
      scanStatus.textContent = "Impossibile accedere alla fotocamera. Controlla permessi o dispositivo.";
      startBtn.disabled = false;
    }
  }
});
stopBtn.addEventListener("click", async () => {
  stopBtn.disabled = true;
  scanStatus.textContent = "Arresto scanner…";
  try {
    await html5QrCode.stop();
    html5QrCode.clear();
    scanStatus.textContent = "Scanner fermato.";
  } catch (err) {
    console.error(err);
    scanStatus.textContent = "Errore nello stop dello scanner.";
  } finally {
    startBtn.disabled = false;
  }
});
// Callback chiamata quando viene decodificato qualcosa
async function onScanSuccess(decodedText, decodedResult) {
  // decodedText contiene la stringa letta (es. "9788804668231")
  const isbnRaw = decodedText.replace(/\D/g, ""); // rimuove tutto tranne cifre
  const isISBN13 = isbnRaw.length === 13 && (isbnRaw.startsWith("978") || isbnRaw.startsWith("979"));
  if (!isISBN13) {
    scanStatus.textContent = "Codice letto ma non è un ISBN-13 valido. Riprova.";
    return;
  }
  // avvisa e ferma lo scanner per evitare doppie letture
  scanStatus.textContent = `ISBN rilevato: ${isbnRaw}. Recupero dati...`;
  try { await html5QrCode.stop(); html5QrCode.clear(); } catch(_) {}
  // fetch via Open Library Books API (più adatta quando hai ISBN)
  try {
    const book = await fetchOpenLibraryByISBN(isbnRaw);
    if (book) {
      // renderBooks si aspetta un array -> trasformiamo in array di un elemento
      renderBooks([book]);
      scanStatus.textContent = "Libro trovato!";
    } else {
      document.getElementById("results").textContent = "Nessun libro trovato per questo ISBN.";
      scanStatus.textContent = "Nessun risultato su Open Library.";
    }
  } catch (err) {
    console.error(err);
    document.getElementById("results").textContent = "Errore durante il recupero del libro.";
    scanStatus.textContent = "Errore nella ricerca ISBN.";
  } finally {
    stopBtn.disabled = true;
    startBtn.disabled = false;
  }
}
function onScanFailure(error) {
  // viene chiamata moltissime volte per frame non riconosciuti; non loggare troppo
  // possibili implementazioni: contatore di errori, messaggio all'utente ecc.
}
// helper: chiama Open Library Books API per ISBN e restituisce l'oggetto jscmd=data
async function fetchOpenLibraryByISBN(isbn13) {
  const url = `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn13}&format=json&jscmd=data`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Open Library non risponde");
  const data = await res.json();
  return data[`ISBN:${isbn13}`] || null;
}