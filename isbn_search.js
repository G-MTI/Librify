const html5QrCode = new Html5Qrcode("reader");

const startBtn = document.getElementById("btn-start-scan");
const stopBtn = document.getElementById("btn-stop-scan");
const scanStatus = document.getElementById("scan-status");

// Configurazione scanner
const config = {
  fps: 10,
  qrbox: { width: 300, height: 120 },
  formatsToSupport: [Html5QrcodeSupportedFormats.EAN_13] // leggiamo solo codici EAN-13 (ISBN)
};

//START SCANNER
startBtn.addEventListener("click", async () => {
  document.getElementById("scanner").style.display = "block";
  scanStatus.textContent = "camera permissions required";
  startBtn.disabled = true;

  try {
    // Prova la camera posteriore con "exact"
    await html5QrCode.start(
      { facingMode: { exact: "environment" } },
      config,
      onScanSuccess,
      onScanFailure
    );
    scanStatus.textContent = "scanner started: please scan a barcode.";
    stopBtn.disabled = false;

  } catch (err) {
    // Fallback se "exact" non è supportato
    try {
      await html5QrCode.start({ facingMode: "environment" }, config, onScanSuccess, onScanFailure);
      scanStatus.textContent = "scanner started: please scan a barcode.";
      stopBtn.disabled = false;
    } catch (e) {
      console.error(e);
      scanStatus.textContent = "Error starting scanner. Please check camera permissions.";
      startBtn.disabled = false;
    }
  }
});

//  STOP SCANNER
stopBtn.addEventListener("click", async () => {
  stopBtn.disabled = true;
  scanStatus.textContent = "Stopping scanner...";
  try {
    await html5QrCode.stop(); // ferma la fotocamera
    html5QrCode.clear();      // pulisce il div reader
    scanStatus.textContent = "Scanner stopped.";
  } catch (err) {
    console.error(err);
    scanStatus.textContent = "Error stopping scanner.";
  } finally {
    startBtn.disabled = false;
    document.getElementById("scanner").style.display = "none";
  }
});

//  CALLBACK SUCCESSO SCANSIONE
async function onScanSuccess(decodedText, decodedResult) {
  // Rimuove tutto tranne cifre
  const isbnRaw = decodedText.replace(/\D/g, "");

  // Controllo che sia un ISBN-13 valido
  if (!(isbnRaw.length === 13 && (isbnRaw.startsWith("978") || isbnRaw.startsWith("979")))) {
    scanStatus.textContent = "code not valid";
    return;
  }

  // Avviso all'utente
  scanStatus.textContent = `ISBN found: ${isbnRaw}. Retrieving data...`;

  // Fermo scanner subito per evitare doppie letture
  try {
    await html5QrCode.stop();
    html5QrCode.clear();
  } catch (_) {
    console.warn("Error stopping scanner (non-critical).");
  }

  try {
    // performSearch deve accettare una query ISBN o testo
    await performSearch(isbnRaw);
    scanStatus.textContent = "Book found!";
    document.getElementById("scanner").style.display = "none";
  } catch (err) {
    console.error(err);
    document.getElementById("results").textContent = "Error during book search.";
    scanStatus.textContent = "Error in ISBN search.";
  } finally {
    // Disabilito il tasto stop, riabilito start
    stopBtn.disabled = true;
    startBtn.disabled = false;
    document.getElementById("scanner").style.display = "none";
  }
}

// CALLBACK FALLIMENTO SCANSIONE-
function onScanFailure(error) {

}