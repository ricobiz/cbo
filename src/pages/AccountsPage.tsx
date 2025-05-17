
import { AccountManager } from "@/components/accounts/AccountManager";

const AccountsPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Управление аккаунтами</h1>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <AccountManager />
      </div>
    </div>
  );
};

export default AccountsPage;
