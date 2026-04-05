package main;

import ui.SPDFViewer;
import java.io.File;

public class Main {

    public static void main(String[] args) {
        SPDFViewer viewer = new SPDFViewer();
        viewer.setVisible(true);

        // ✅ If file is opened via double-click or "Open With"
        if (args.length > 0) {
            File file = new File(args[0]);

            if (file.exists()) {
                viewer.openFileFromOutside(file);
            }
        }
    }
}