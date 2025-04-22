import SuperAdminLoginForm from "@/components/auth/superadmin/sa-login-form";

export default function SuperAdminLoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <SuperAdminLoginForm />
        <div className="relative hidden bg-muted md:block">
          <img
            src="https://img.freepik.com/free-vector/realistic-neon-lights-background_23-2148907367.jpg"
            alt="Image"
            className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          />
        </div>
      </div>
    </div>
  );
}
