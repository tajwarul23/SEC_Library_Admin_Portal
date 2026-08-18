import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../../../hooks/useAuth.jsx";
import { loginSchema } from "../../../utils/validationSchemas.js";
import { Lock, IdCard, Eye, EyeOff, ShieldCheck, AlertCircle, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "../../../assets/logo.png";

export const LoginForm = () => {
  const { login, isLoggingIn } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      regNo: "",
      password: ""
    }
  });

  const navigate = useNavigate();

const onSubmit = async (data) => {
  setErrorMsg(null);
  try {
    await login(data);
    const destination = location.state?.from?.pathname || "/overview";
    navigate(destination, { replace: true });
  } catch (err) {
    setErrorMsg(err.message || "Invalid credentials. Please verify and try again.");
  }
};

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 select-none">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        {/* SEC Institutional Top Header */}
        <div className="bg-slate-900 text-white p-6 sm:p-8 text-center border-b-2 border-amber-600">
          <img src={logo} alt="Sylhet Engineering College" className="mx-auto w-20 h-20 object-contain mb-3" />
          <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-semibold tracking-wider uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-1">
            Library Admin Portal
          </span>
          <h1 className="text-xl font-bold tracking-tight text-white font-serif">
            Sylhet Engineering College
          </h1>
          <p className="text-xs text-slate-300 tracking-wide mt-0.5 uppercase">
             Library Management System
          </p>
        </div>

        {/* Login Body */}
        <div className="p-6 sm:p-8">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-slate-900 tracking-tight">
              Administrative Authentication
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Restricted access. Authorized library staff and system administrators only.
            </p>
          </div>

          {errorMsg && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded text-xs text-red-700 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Authentication Error</p>
                <p className="mt-0.5 text-red-600">{errorMsg}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" autoComplete="off">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Admin Registration Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <IdCard className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  autoComplete="off"
                  {...register("regNo")}

                  className={`w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border ${
                    errors.regNo ? "border-red-500" : "border-slate-300"
                  } rounded text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-colors`}
                />
              </div>
              {errors.regNo && (
                <p className="mt-1 text-xs text-red-600 font-medium">{errors.regNo.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Security Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="off"
                  {...register("password")}

                  className={`w-full pl-9 pr-10 py-2 text-sm bg-slate-50 border ${
                    errors.password ? "border-red-500" : "border-slate-300"
                  } rounded text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-colors`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-600 font-medium">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full mt-2 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authenticating Credentials...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Access Admin Portal</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer info */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 text-center">
          <p className="text-[11px] text-slate-500">
            Sylhet Engineering College 
          </p>
        </div>
      </div>
    </div>
  );
};
