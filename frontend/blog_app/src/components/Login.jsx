import {
  Card,
  Button,
  Separator,
  Spinner,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import Logo from "./../assets/logo.png";
import LogoDark from "./../assets/logo_oscuro.png";
import { useState } from "react";
import { Person, Key, Envelope } from "@gravity-ui/icons";
import { useTheme } from "../store/useThemeStore";
import Image from "../components/Image";
import Input from "../components/Inputs/Input";
import { useNavigate } from "react-router-dom";
import { validateField } from "../utils";
import { useAuthStore } from "../store/useAuthStore";
import { toast } from "@heroui/react";

const Login = () => {
  const [haveAccount, setHaveAccount] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const navigate = useNavigate();

  const { theme } = useTheme();
  const { register, login } = useAuthStore();
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {
      email: validateField("email", email),
      password: validateField("password", password),
      ...(haveAccount ? {} : { name: validateField("name", name) }),
    };
    setErrors(newErrors);
    setTouched({ name: true, email: true, password: true });
    if (Object.values(newErrors).some(Boolean)) return;
  
    setLoading(true);
    try {
      const action = haveAccount
        ? login(email, password)
        : register(name, email, password);
  
      toast.promise(action, {
        loading: haveAccount ? "Iniciando sesión..." : "Creando tu cuenta...",
        success: (user) => `Bienvenido, ${user.name}`,
        error: (err) => err.message,
      });
  
      await action;
      navigate("/");
    } catch {
      console.error
    } finally {
      setLoading(false);   
    }
  };

  return (
    <>
     

      <div className="flex min-h-screen items-center justify-center bg-[#faf7f4] dark:bg-zinc-900">
        <Card
          variant="transparent"
          className="relative flex w-full max-w-md bg-transparent shadow-none"
        >
          <Image
            src={theme === "light" ? Logo : LogoDark}
            alt="Logo"
            className="my-4 h-37.5 w-[37.5] mx-auto"
          />

          <Card.Header className="flex gap-y-1 mb-2">
            <Card.Title className="text-2xl text-gray-600 font-semibold dark:text-gray-200">
              {haveAccount
                ? "Log In to your account"
                : "Sign Up for an account"}
            </Card.Title>
          </Card.Header>
          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            {/* name */}
            {!haveAccount && (
              <label className="flex flex-col gap-2 text-sm font-medium text-gray-600">
                <div className="flex gap-1 dark:text-gray-200">
                  Name
                  <span className="text-red-500">*</span>
                </div>
                <div>
                  <div className="relative">
                    <Person className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      type="text"
                      value={name}
                      onBlur={() => {
                        setTouched((t) => ({ ...t, name: true }));
                        setErrors((er) => ({
                          ...er,
                          name: validateField("name", name),
                        }));
                      }}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (touched.name)
                          setErrors((er) => ({
                            ...er,
                            name: validateField("name", e.target.value),
                          }));
                      }}
                      required
                      placeholder="Your name"
                      className={`w-full rounded-full py-3.5 pl-11 pr-4 text-md outline-none placeholder:text-gray-400 focus:ring-0
                      ${theme === "light" ? "bg-white border border-gray-200 text-gray-700" : "bg-zinc-900 border border-zinc-700 text-gray-100"}`}
                    />
                  </div>
                </div>
                {touched.name && errors.name && (
                  <p className="text-md ml-3 text-red-500">{errors.name}</p>
                )}
              </label>
            )}
            {/* Email */}
            <label className="flex flex-col gap-2 text-sm font-medium text-gray-600">
              <div className="flex gap-1 dark:text-gray-200">
                Email
                <span className="text-red-500">*</span>
              </div>
              <div>
                <div className="relative">
                  <Envelope className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    type="email"
                    value={email}
                    onBlur={() => {
                      setTouched((t) => ({ ...t, email: true }));
                      setErrors((er) => ({
                        ...er,
                        email: validateField("email", email),
                      }));
                    }}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (touched.email)
                        setErrors((er) => ({
                          ...er,
                          email: validateField("email", e.target.value),
                        }));
                    }}
                    required
                    placeholder="Your email"
                    className={`w-full rounded-full py-3.5 pl-11 pr-4 text-md outline-none placeholder:text-gray-400 focus:ring-0
                    ${theme === "light" ? "bg-white border border-gray-200 text-gray-700" : "bg-zinc-900 border border-zinc-700 text-gray-100"}`}
                  />
                </div>
              </div>
              {touched.email && errors.email && (
                <p className="text-md ml-3 text-red-500">{errors.email}</p>
              )}
            </label>
            {/* Password */}
            <label className="flex flex-col gap-2 text-sm font-medium text-gray-600">
              <div className="flex gap-1 dark:text-gray-200">
                Password
                <span className="text-red-500">*</span>
              </div>
              <div>
                <div className="relative">
                  <Key className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    type="password"
                    value={password}
                    onBlur={() => {
                      setTouched((t) => ({ ...t, password: true }));
                      setErrors((er) => ({
                        ...er,
                        password: validateField("password", password),
                      }));
                    }}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (touched.password)
                        setErrors((er) => ({
                          ...er,
                          password: validateField("password", e.target.value),
                        }));
                    }}
                    required
                    placeholder="Password"
                    className={`w-full rounded-full py-3.5 pl-11 pr-4 text-md outline-none placeholder:text-gray-400 focus:ring-0
                    ${theme === "light" ? "bg-white border border-gray-200 text-gray-700" : "bg-zinc-900 border border-zinc-700 text-gray-100"}`}
                  />
                </div>
              </div>
              {touched.password && errors.password && (
                <p className="text-md ml-3 text-red-500">{errors.password}</p>
              )}
            </label>
            <div className="flex w-full items-center gap-3 px-4 text-gray-400">
              <Separator className="flex-1" />
              <span className="shrink-0 text-sm">or</span>
              <Separator className="flex-1" />
            </div>
            {/* social icons */}
            <Button className="w-full py-6" variant="tertiary">
              <Icon icon="devicon:google" />
              {haveAccount ? "Sign in with Google" : "Sign up with Google"}
            </Button>
            <Card.Footer className="mt-1 flex flex-col gap-2">
              <Button
                className="w-full h-12 mt-4"
                isDisabled={loading}
                type="submit"
              >
                {loading ? (
                  <>
                    <Spinner color="current" size="sm" />
                    <span>{haveAccount ? "Sign In..." : "Sign Up..."}</span>
                  </>
                ) : (
                  <span>{haveAccount ? "Sign In" : "Sign Up"}</span>
                )}
              </Button>
              <div className="flex">
                <p className="text-sm text-gray-500">
                  {haveAccount
                    ? "Don't have an account?"
                    : "Already have an account?"}
                  <Button
                    variant="ghost"
                    onClick={() => setHaveAccount(!haveAccount)}
                  >
                    <span className="text-blue-300">
                      {haveAccount ? "Create one" : "Sign in"}
                    </span>
                  </Button>
                </p>
              </div>
            </Card.Footer>
          </form>
        </Card>
      </div>
    </>
  );
};

export default Login;
