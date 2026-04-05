package ui;

import core.SPDFService;
import javax.print.PrintService;
import javax.print.PrintServiceLookup;
import javax.swing.*;
import java.awt.*;
import java.awt.event.*;
import java.awt.image.BufferedImage;
import java.io.*;
import java.util.*;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.rendering.PDFRenderer;
import org.apache.pdfbox.printing.PDFPageable;

import java.awt.print.PrinterJob;

import com.formdev.flatlaf.FlatLightLaf;
import com.formdev.flatlaf.FlatDarkLaf;

public class SPDFViewer extends JFrame {

    CardLayout cardLayout;
    JPanel mainPanel;

    JPanel homePanel;
    JPanel viewerPanel;

    JScrollPane scrollPane;
    JPanel pagesPanel;
    JPanel thumbnailsPanel;

    JSplitPane splitPane;

    JLabel statusBar;

    JButton openButton, printButton, zoomIn, zoomOut, themeButton, backButton;

    PDDocument document;
    PDFRenderer renderer;

    ArrayList<BufferedImage> pages = new ArrayList<>();

    double zoom = 1.5;
    File currentFile;

    public SPDFViewer() {

        setTitle("SPDF Reader");
        setSize(1100, 900);
        setDefaultCloseOperation(EXIT_ON_CLOSE);
        setLayout(new BorderLayout());

        JPanel toolbar = new JPanel(new FlowLayout(FlowLayout.LEFT, 10, 10));

        openButton = new JButton("Open");
        printButton = new JButton("Print");
        zoomIn = new JButton("+");
        zoomOut = new JButton("-");
        themeButton = new JButton("Dark Mode");
        backButton = new JButton("Back");

        JButton[] buttons = {openButton, printButton, zoomIn, zoomOut, themeButton, backButton};
        for (JButton b : buttons) styleButton(b);

        toolbar.add(openButton);
        toolbar.add(printButton);
        toolbar.add(new JSeparator(SwingConstants.VERTICAL));
        toolbar.add(zoomIn);
        toolbar.add(zoomOut);
        toolbar.add(new JSeparator(SwingConstants.VERTICAL));
        toolbar.add(themeButton);
        toolbar.add(backButton);

        add(toolbar, BorderLayout.NORTH);

        cardLayout = new CardLayout();
        mainPanel = new JPanel(cardLayout);

        createHomeUI();
        createViewerUI();

        mainPanel.add(homePanel, "HOME");
        mainPanel.add(viewerPanel, "VIEWER");

        cardLayout.show(mainPanel, "HOME");

        add(mainPanel, BorderLayout.CENTER);

        statusBar = new JLabel(" Ready");
        add(statusBar, BorderLayout.SOUTH);

        openButton.addActionListener(e -> openFileChooser());

        zoomIn.addActionListener(e -> {
            zoom += 0.2;
            reloadPages();
        });

        zoomOut.addActionListener(e -> {
            zoom = Math.max(0.5, zoom - 0.2);
            reloadPages();
        });

        printButton.addActionListener(e -> printFile());

        themeButton.addActionListener(e -> toggleTheme());

        backButton.addActionListener(e -> cardLayout.show(mainPanel, "HOME"));
    }

    void createHomeUI() {
        homePanel = new JPanel(new GridBagLayout());

        JButton openBtn = new JButton("Open File");
        JButton exitBtn = new JButton("Exit");

        styleButton(openBtn);
        styleButton(exitBtn);

        JPanel card = new JPanel();
        card.add(openBtn);
        card.add(exitBtn);

        homePanel.add(card);

        openBtn.addActionListener(e -> openFileChooser());
        exitBtn.addActionListener(e -> System.exit(0));
    }

    void createViewerUI() {
        viewerPanel = new JPanel(new BorderLayout());

        pagesPanel = new JPanel();
        pagesPanel.setLayout(new BoxLayout(pagesPanel, BoxLayout.Y_AXIS));

        scrollPane = new JScrollPane(pagesPanel);

        thumbnailsPanel = new JPanel();
        thumbnailsPanel.setLayout(new BoxLayout(thumbnailsPanel, BoxLayout.Y_AXIS));

        JScrollPane thumbScroll = new JScrollPane(thumbnailsPanel);
        thumbScroll.setPreferredSize(new Dimension(150, 0));

        splitPane = new JSplitPane(JSplitPane.HORIZONTAL_SPLIT, thumbScroll, scrollPane);

        viewerPanel.add(splitPane, BorderLayout.CENTER);
    }

    void styleButton(JButton btn) {
        btn.setFocusPainted(false);
    }

    // ===== FILE OPEN =====
    void openFileChooser() {
        JFileChooser chooser = new JFileChooser();
        if (chooser.showOpenDialog(this) == JFileChooser.APPROVE_OPTION) {
            openFileFromPath(chooser.getSelectedFile().getAbsolutePath());
        }
    }

    void openFileFromPath(String path) {
        File file = new File(path);
        if (file.exists()) {
            openFileFromOutside(file);
        } else {
            JOptionPane.showMessageDialog(this, "File not found!");
        }
    }

    public void openFileFromOutside(File file) {
        try {
            this.currentFile = file;

            String input = JOptionPane.showInputDialog(this, "Enter Password:");

            if (input == null || input.isEmpty()) return;

            byte[] pdfBytes = SPDFService.processFile(file, input);

            displayPDF(pdfBytes);

        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    // ===== DISPLAY PDF =====
    void displayPDF(byte[] pdfBytes) {
        try {
            if (document != null) document.close();

            document = PDDocument.load(pdfBytes);
            renderer = new PDFRenderer(document);

            loadAllPages();
            showAllPages();
            createThumbnails();

            cardLayout.show(mainPanel, "VIEWER");

            setTitle("SPDF Reader - " + currentFile.getName());

        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, "Error opening PDF");
        }
    }

    void loadAllPages() throws IOException {
        pages.clear();
        for (int i = 0; i < document.getNumberOfPages(); i++) {
            pages.add(renderer.renderImage(i, (float) zoom));
        }
    }

    void reloadPages() {
        try {
            loadAllPages();
            showAllPages();
            createThumbnails();
        } catch (Exception e) {}
    }

    void showAllPages() {
        pagesPanel.removeAll();

        for (BufferedImage img : pages) {
            JLabel label = new JLabel(new ImageIcon(img));
            pagesPanel.add(label);
        }

        pagesPanel.revalidate();
    }

    void createThumbnails() {
        thumbnailsPanel.removeAll();

        for (int i = 0; i < pages.size(); i++) {
            int index = i;
            Image thumb = pages.get(i).getScaledInstance(100, 120, Image.SCALE_SMOOTH);

            JLabel label = new JLabel(new ImageIcon(thumb));
            label.addMouseListener(new MouseAdapter() {
                public void mouseClicked(MouseEvent e) {
                   

Component comp = pagesPanel.getComponent(index);
((JComponent) comp).scrollRectToVisible(comp.getBounds());


                }
            });

            thumbnailsPanel.add(label);
        }

        thumbnailsPanel.revalidate();
    }

    // ===== PRINT =====
    void printFile() {
        try {
            if (document == null) return;

            PrinterJob job = PrinterJob.getPrinterJob();
            job.setPageable(new PDFPageable(document));
            job.print();

        } catch (Exception e) {}
    }

    void toggleTheme() {
        try {
            if (themeButton.getText().equals("Dark Mode")) {
                UIManager.setLookAndFeel(new FlatDarkLaf());
                themeButton.setText("Light Mode");
            } else {
                UIManager.setLookAndFeel(new FlatLightLaf());
                themeButton.setText("Dark Mode");
            }
            SwingUtilities.updateComponentTreeUI(this);
        } catch (Exception e) {}
    }

    public static void main(String[] args) {
        try {
            UIManager.setLookAndFeel(new FlatLightLaf());
        } catch (Exception e) {}

        SwingUtilities.invokeLater(() -> {
            SPDFViewer viewer = new SPDFViewer();
            viewer.setVisible(true);

            if (args.length > 0) {
                File file = new File(args[0]);
                if (file.exists()) {
                    viewer.openFileFromOutside(file);
                }
            }
        });
    }
}