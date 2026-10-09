import { Capacitor } from "@capacitor/core";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { DeviceShake } from "../plugins/deviceShake";
import ConfirmDialog from "./ConfirmDialog";

// bij schudden vragen of je wilt uitloggen
export default function ShakeToLogout() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    // popup openen bij een schud
    DeviceShake.addListener("shake", () => {
      console.log("Device shaken!");
      setOpen(true);
    });
    return () => {
      DeviceShake.removeAllListeners();
    };
  }, []);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    // alleen luisteren als je ingelogd bent
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
