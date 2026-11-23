import { PasswordInput } from "@/components/dusk/input/password-input";

export default function PasswordInputDemo() {
  return (
    <div className="w-full max-w-sm">
      <PasswordInput placeholder="Create a password" autoComplete="new-password" showStrength />
    </div>
  );
}
