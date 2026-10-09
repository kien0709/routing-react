import { Capacitor } from "@capacitor/core";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { DeviceShake } from "../plugins/deviceShake";
import ConfirmDialog from "./ConfirmDialog";

// schud je telefoon terwijl je ingelogd bent dan vragen we of je wilt uitloggen
// niet ingelogd dan luistert de plugin niet dus schudden doet niks
// alleen in de app want de plugin is native zie src plugins deviceShake ts
export default function ShakeToLogout() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // de listener een keer aanmaken en weer opruimen als de app sluit zoals in de opdracht
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    DeviceShake.addListener("shake", () => {
      console.log("Device shaken!");
      setOpen(true);
    });
    return () => {
      DeviceShake.removeAllListeners();
    };
  }, []);

  // alleen naar schudden luisteren als je ingelogd bent
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    if (isAuthenticated) DeviceShake.enableListening();
    else DeviceShake.stopListening();
  }, [isAuthenticated]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      navigate("/login");
    } finally {
      setLoggingOut(false);
      setOpen(false);
    }
  };

  return (
    <ConfirmDialog
      open={open && isAuthenticated}
      title="Log out?"
      description="You shook your device. Do you want to log out?"
      confirmLabel="Log out"
      loading={loggingOut}
      onConfirm={handleLogout}
      onClose={() => setOpen(false)}
    />
  );
}
