
import React from "react";
import { AdminUsers } from "./AdminUsers";
import ErrorBoundary from "../ErrorBoundary";
import { Button } from "../ui/button";
import { RefreshCw } from "lucide-react";

export const AdminUsersWrapper = () => {
  return (
    <ErrorBoundary
      componentName="AdminUsers"
      fallback={
        <div className="p-8 border rounded-md bg-red-50 text-center">
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Ошибка при загрузке списка пользователей
          </h3>
          <p className="text-red-700 mb-4">
            Произошла ошибка при загрузке или обработке данных пользователей. 
            Пожалуйста, попробуйте обновить страницу.
          </p>
          <Button 
            onClick={() => window.location.reload()}
            variant="outline" 
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Обновить страницу
          </Button>
        </div>
      }
    >
      <AdminUsers />
    </ErrorBoundary>
  );
};
