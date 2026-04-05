package core;

public class SPDFParser {

    public static String getValue(String content, String key) {
        try {
            int start = content.indexOf("\"" + key + "\"");
            if (start == -1) return "";

            int colon = content.indexOf(":", start);
            int comma = content.indexOf(",", colon);

            if (comma == -1) comma = content.indexOf("}", colon);

            String value = content.substring(colon + 1, comma).trim();

            if (value.startsWith("\"") && value.endsWith("\"")) {
                value = value.substring(1, value.length() - 1);
            }

            return value;

        } catch (Exception e) {
            return "";
        }
    }
}