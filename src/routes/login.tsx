import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff, Wifi } from "lucide-react";
import { Logo } from "@/components/Logo";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({ meta: [{ title: "سياج — تسجيل الدخول" }] }),
});

function LoginPage() {
  const nav = useNavigate();
  const [ip, setIp] = useState("192.168.1.1");
  const [user, setUser] = useState("admin");
  const [pass, setPass] = useState("");
  const [show, setShow] = useState(false);

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col px-6 py-10">
      <div className="flex flex-1 flex-col justify-center">
        <div className="mb-10 text-center">
          <div className="mx-auto mb-5 flex justify-center">
            <Logo size={96} />
          </div>
          <h1 className="font-display text-4xl font-bold tracking-tight">
            <span className="bg-gradient-primary bg-clip-text text-transparent animate-gradient-shift">سياج</span>
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">تحكّم كامل بالراوتر بأمان</p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            nav({ to: "/" });
          }}
          className="space-y-3"
        >
          <Input icon={Wifi} placeholder="عنوان الراوتر" value={ip} onChange={setIp} dir="ltr" />
          <Input placeholder="اسم المستخدم" value={user} onChange={setUser} />
          <div className="glass flex items-center gap-2 rounded-2xl px-4 py-3.5">
            <input
              type={show ? "text" : "password"}
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder="كلمة المرور"
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              dir="ltr"
            />
            <button type="button" onClick={() => setShow((v) => !v)} className="text-muted-foreground">
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          <button
            type="submit"
            className="bg-gradient-primary mt-2 w-full rounded-2xl py-3.5 font-semibold text-primary-foreground shadow-glow transition-smooth active:scale-[0.98]"
          >
            دخول
          </button>
        </form>
      </div>

      <p className="text-center text-[11px] text-muted-foreground">© 2026 سياج · جميع الحقوق محفوظة</p>
    </div>
  );
}

function Input({ icon: Icon, placeholder, value, onChange, dir }: any) {
  return (
    <div className="glass flex items-center gap-2 rounded-2xl px-4 py-3.5">
      {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        dir={dir}
        className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
      />
    </div>
  );
}
