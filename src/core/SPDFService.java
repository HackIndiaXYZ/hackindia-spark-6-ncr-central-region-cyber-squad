package core;

import java.io.*;
import java.nio.file.*;
import java.time.*;
import java.util.Base64;
import java.security.MessageDigest;

import utils.DeviceUtils;
import utils.CryptoUtil;

public class SPDFService {

    public static byte[] processFile(File file, String inputPassword) throws Exception {

        // 1️⃣ Read encrypted file
        String encryptedContent = new String(Files.readAllBytes(file.toPath())).trim();

        if (encryptedContent.isEmpty()) {
            throw new Exception("File is empty or corrupted!");
        }

        // 2️⃣ Decrypt JSON
        String decryptedContent;
        try {
            decryptedContent = CryptoUtil.decrypt(encryptedContent);
        } catch (Exception e) {
            throw new Exception("Failed to decrypt file (corrupted or invalid key)");
        }

        // 3️⃣ Extract values
        String expiry = SPDFParser.getValue(decryptedContent, "expiry");
        String data = SPDFParser.getValue(decryptedContent, "data");
        String passwordHash = SPDFParser.getValue(decryptedContent, "password");
        String macStored = SPDFParser.getValue(decryptedContent, "mac");

        int maxOpen = parseIntSafe(SPDFParser.getValue(decryptedContent, "maxOpen"), 1);
        int usedOpen = parseIntSafe(SPDFParser.getValue(decryptedContent, "usedOpen"), 0);
        int usedPrint = parseIntSafe(SPDFParser.getValue(decryptedContent, "usedPrint"), 0);

        // 4️⃣ EXPIRY CHECK
        if (expiry != null && !expiry.isEmpty()) {
            try {
                LocalDateTime expiryDate = LocalDateTime.parse(expiry);
                if (LocalDateTime.now().isAfter(expiryDate)) {
                    throw new Exception("File expired!");
                }
            } catch (Exception e) {
                throw new Exception("Invalid expiry format!");
            }
        }

        // 5️⃣ PASSWORD CHECK
        if (inputPassword == null || inputPassword.isEmpty()) {
            throw new Exception("Password required!");
        }

        String hashedInput = hashPassword(inputPassword);

        if (passwordHash == null || !passwordHash.equals(hashedInput)) {
            throw new Exception("Wrong password!");
        }

        // 6️⃣ MAC LOCK
        String currentMac = DeviceUtils.getMac();

        if (macStored == null || macStored.isEmpty()) {
            macStored = currentMac;
        } else if (!macStored.equals(currentMac)) {
            throw new Exception("File locked to another device!");
        }

        // 7️⃣ OPEN LIMIT
        if (usedOpen >= maxOpen) {
            throw new Exception("Open limit reached!");
        }

        usedOpen++;

        // 8️⃣ UPDATE FILE (re-encrypt)
        updateFile(file, decryptedContent, macStored, usedOpen, usedPrint);

        // 9️⃣ DECODE PDF
        if (data == null || data.isEmpty()) {
            throw new Exception("PDF data missing!");
        }

        try {
            return Base64.getDecoder().decode(data);
        } catch (Exception e) {
            throw new Exception("Invalid PDF data!");
        }
    }

    // ===== SAFE INT =====
    private static int parseIntSafe(String value, int defaultValue) {
        try {
            return Integer.parseInt(value.trim());
        } catch (Exception e) {
            return defaultValue;
        }
    }

    // ===== PASSWORD HASH =====
    private static String hashPassword(String password) throws Exception {
        MessageDigest md = MessageDigest.getInstance("SHA-256");
        byte[] hashed = md.digest(password.getBytes());

        StringBuilder sb = new StringBuilder();
        for (byte b : hashed) {
            sb.append(String.format("%02x", b));
        }
        return sb.toString();
    }

    // ===== UPDATE FILE =====
    private static void updateFile(File file, String content, String mac, int usedOpen, int usedPrint) throws Exception {

        String updated = content
                .replace("\"mac\": \"" + SPDFParser.getValue(content, "mac") + "\"",
                        "\"mac\": \"" + mac + "\"")
                .replace("\"usedOpen\": " + SPDFParser.getValue(content, "usedOpen"),
                        "\"usedOpen\": " + usedOpen)
                .replace("\"usedPrint\": " + SPDFParser.getValue(content, "usedPrint"),
                        "\"usedPrint\": " + usedPrint);

        // 🔐 Re-encrypt
        String encryptedUpdated = CryptoUtil.encrypt(updated);

        Files.write(file.toPath(), encryptedUpdated.getBytes());
    }
}