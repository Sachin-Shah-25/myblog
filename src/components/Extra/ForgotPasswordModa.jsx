"use client";
import { useState, useTransition, useEffect } from "react";
import Link from "next/link";
import { FaMoon, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaTimes } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useMutation } from "@tanstack/react-query";
import FullScreenLoader from "./FullScreenLoader";


function ForgotPasswordModal({ onClose }) {
  // step: 1 = email line hai  107, 2 = otp,linr142
  //  3 = new password, 4 = success
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [getError, setError] = useState("");


  const mutation = useMutation({
    mutationFn: async (getEmail) => {
      const res = await fetch("/api/auth/sendmail", {
        method: "POST",
        body: JSON.stringify({
          getEmail
        }),
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include"
      })

      if (!res.ok) {
        throw new Error("Something Went wrong")
      }

      const result = await res.json()
      return result
    },

    onSuccess: (data) => {
      if (data.success) {
        setStep(2)
      }
    },
    onError: (err) => {
      setError("Something went wrong ")
      setStep(1)
    }
  });
  const changeMutation = useMutation({
    mutationFn: async ({ myEmail, myPass }) => {
      const res = await fetch("/api/auth/changepass", {
        method: "POST",
        body: JSON.stringify({ myEmail, myPass }),
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include"
      })

      if (res.status === 404) {
        throw new Error("EMAIL_NOT_FOUND")
      }

      if (!res.ok) {
        throw new Error("GENERIC_ERROR")
      }

      return res.json()
    },

    onSuccess: (data) => {
      if (data.success) {
        setStep(4)
      }
    },

    onError: (err) => {
      if (err.message === "EMAIL_NOT_FOUND") {
        setError("Email Not Registered!")
      } else {
        setError("Something went wrong")
      }
    }
  })

  const handleOtpChange = (val, index) => {
    if (getError) {
      setError("")
    }
    if (!/^[0-9]?$/.test(val)) return;
    const updated = [...otp];
    updated[index] = val;
    setOtp(updated);
    if (val && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleOtpBack = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const getStrength = (p) => {
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    const map = [
      { label: "", color: "#e5e7eb", width: "0%" },
      { label: "Weak", color: "#ef4444", width: "25%" },
      { label: "Fair", color: "#f97316", width: "50%" },
      { label: "Good", color: "#eab308", width: "75%" },
      { label: "Strong", color: "#22c55e", width: "100%" },
    ];
    return map[score] || map[0];
  };

  const strength = getStrength(newPass);

  const handleSendOtp = async () => {
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email.");
      return;
    }
    try {
      const res = await fetch("/api/auth/emailcheck", {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include"
      })
      if (res.status === 404) {
        setError("Email not registered")
        return
      }
      if (!res.ok) {
        throw new Error("Something went wrong")
      }
      const result = await res.json()
      mutation.mutate(email)


    }
    catch (e) {
      console.log(e.message)
    } finally {
      setError("")
    }
  };

  const handleVerifyOtp = () => {
    if (getError) {
      setError("")
    }
    const entered = otp.join("");
    if (entered.length < 6) {
      setError("Please enter all 6 digits.");
      return;
    }
    if (!mutation.isSuccess || !mutation.data?.success) {
      setStep(2)
      setError("Something went wrong");
      return
    }
    const serverOtp = mutation.data.Otp
    if (serverOtp != entered) {
      setError("Invalid Otp !")
      return;
    }
    setStep(3);
    setOtp(["", "", "", "", "", ""])
   
  };

  const handleChangePassword = () => {
    if (!newPass || newPass.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (newPass !== confirmPass) {
      setError("Passwords do not match.");
      return;
    }

    changeMutation.mutate({
      myEmail: email,
      myPass: newPass
    })
    setError("");
    setEmail("");
    setNewPass("");
    setConfirmPass("")

  };



  if (mutation.isPending || changeMutation.isPending) {
    return <FullScreenLoader></FullScreenLoader>
  }
  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"

    >
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-6 relative">
        {step !== 4 && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            <FaTimes size={14} />
          </button>
        )}

        {step === 1 && (
          <>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Forgot Password?</h2>
            <p className="text-sm text-gray-500 mb-5">
              Enter your registered email — we'll send you a 6-digit OTP.
            </p>
            <div className="flex items-center border rounded-lg px-3 py-2 focus-within:border-blue-400">
              <FaEnvelope className="text-gray-400 mr-2" />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full outline-none text-sm"
              />
            </div>
            {getError && <p className="text-xs text-red-500 mt-2">{getError}</p>}
            <div className="flex gap-3 mt-5">
              <button
                onClick={onClose}
                className="flex-1 py-2 border rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSendOtp}
                className="flex-[2] py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium cursor-pointer transition"
              >
                Send OTP
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Enter OTP</h2>
            <p className="text-sm text-gray-500 mb-5">
              We've sent a 6-digit code to{" "}
              <span className="text-gray-800 font-medium">{email}</span>
            </p>
            <div className="flex gap-2 justify-center mb-2">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, i)}
                  onKeyDown={(e) => handleOtpBack(e, i)}
                  className={`w-11 h-12 text-center text-lg font-semibold border rounded-lg outline-none transition
                    ${digit ? "border-blue-400 bg-blue-50" : "border-gray-200"}
                    focus:border-blue-400`}
                />
              ))}
            </div>
            {getError && <p className="text-xs text-red-500 mt-1 text-center">{getError}</p>}
            <p className="text-center text-xs text-gray-400 mt-3">
              Didn't receive?{" "}
              <span
                className="text-blue-500 font-medium cursor-pointer hover:underline"
                onClick={() => {
                  setOtp(["", "", "", "", "", ""]);
                  setError("");
                }}
              >
                Resend OTP
              </span>
            </p>
            <div className="flex gap-3 mt-5">
              <button
                onClick={onClose}
                className="flex-1 py-2 border rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleVerifyOtp}
                className="flex-[2] py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium cursor-pointer transition"
              >
                Verify OTP
              </button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Set New Password</h2>
            <p className="text-sm text-gray-500 mb-5">Choose a strong password for your account.</p>
            <div className="space-y-3">
              <div>
                <div className="flex items-center border rounded-lg px-3 py-2 focus-within:border-blue-400">
                  <FaLock className="text-gray-400 mr-2" />
                  <input
                    type={showNew ? "text" : "password"}
                    placeholder="New Password"
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    className="w-full outline-none text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew((p) => !p)}
                    className="ml-2 text-gray-400 cursor-pointer"
                  >
                    {showNew ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {newPass && (
                  <>
                    <div className="h-1 rounded-full bg-gray-100 mt-2 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{ width: strength.width, background: strength.color }}
                      />
                    </div>
                    <p className="text-xs mt-1" style={{ color: strength.color }}>
                      {strength.label}
                    </p>
                  </>
                )}
              </div>
              <div className="flex items-center border rounded-lg px-3 py-2 focus-within:border-blue-400">
                <FaLock className="text-gray-400 mr-2" />
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  className="w-full outline-none text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((p) => !p)}
                  className="ml-2 text-gray-400 cursor-pointer"
                >
                  {showConfirm ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            {getError && <p className="text-xs text-red-500 mt-2">{getError}</p>}
            <div className="flex gap-3 mt-5">
              <button
                onClick={onClose}
                className="flex-1 py-2 border rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleChangePassword}
                className="flex-[2] py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium cursor-pointer transition"
              >
                Change Password
              </button>
            </div>
          </>
        )}

        {step === 4 && (
          <div className="text-center py-2">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
              ✅
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Password Changed!</h2>
            <p className="text-sm text-gray-500 mb-6">
              Your password has been updated successfully. You can now sign in with your new password.
            </p>
            <button
              onClick={onClose}
              className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium cursor-pointer transition"
            >
              Back to Sign In
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


export default ForgotPasswordModal