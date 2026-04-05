package utils;

import java.net.NetworkInterface;
import java.util.Enumeration;

public class DeviceUtils {

    public static String getMac() {
        try {
            Enumeration<NetworkInterface> nets = NetworkInterface.getNetworkInterfaces();

            while (nets.hasMoreElements()) {
                NetworkInterface net = nets.nextElement();
                byte[] mac = net.getHardwareAddress();

                if (mac != null) {
                    StringBuilder sb = new StringBuilder();
                    for (byte b : mac)
                        sb.append(String.format("%02X", b));
                    return sb.toString();
                }
            }
        } catch (Exception e) {}

        return "";
    }
}