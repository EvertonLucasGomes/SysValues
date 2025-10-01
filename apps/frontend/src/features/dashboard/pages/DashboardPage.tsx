import { FaTree } from "react-icons/fa";
import { SideMenu } from "@/components/layout/SideMenu";
import { EmptyState } from "@/components/ui/EmptyState";
import { SystemInfo } from "@/components/ui/SystemInfo";
import { AlertsTutorial } from "@/components/ui/AlertsTutorial";
import { useDashboard } from "@/hooks/useDashboard";
import { useAlerts } from "@/hooks/useAlerts";
import { useUserOnboarding } from "@/hooks/useUserOnboarding";
import { useOnboardingSteps } from "@/hooks/useOnboardingSteps";
import { useDashboardData } from "@/hooks/useDashboardData";
import { formatTimeAgo } from "@/utils/dateUtils";
import { DashboardKPIs } from "@/components/dashboard/DashboardKPIs";
import { UpcomingActivities } from "@/components/dashboard/UpcomingActivities";
import { CostDistribution } from "@/components/dashboard/CostDistribution";
import { RecentActivities } from "@/components/dashboard/RecentActivities";
import { ProductionChart } from "@/components/dashboard/ProductionChart";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { useState, useEffect } from "react";

export function DashboardPage() {
  const { statistics, loading, error, refreshStatistics } = useDashboard();
  const { alerts, recentActivities, markAlertAsRead } = useAlerts();
  
  // 🎯 MUDANÇA 1: Adicionar 'skipOnboarding' do hook atualizado
  const { isNewUser, hasSeenAlertsTutorial, markAlertsTutorialAsSeen, skipOnboarding } =
    useUserOnboarding();
  
  const { setupSteps, allStepsCompleted } = useOnboardingSteps();
  const { upcomingActivities, costDistribution, periodOptions } =
    useDashboardData();
  const [selectedPeriod, setSelectedPeriod] = useState("6months");
  const [showAlertsTutorial, setShowAlertsTutorial] = useState(false);

  // Mostrar tutorial para novos usuários que ainda não viram
  useEffect(() => {
    if (isNewUser && !hasSeenAlertsTutorial && alerts.length > 0) {
      setShowAlertsTutorial(true);
    }
  }, [isNewUser, hasSeenAlertsTutorial, alerts.length]);

  const shouldShowOnboarding = isNewUser && !allStepsCompleted;

  const recentActivityItems = recentActivities.map((activity) => ({
    id: activity.id,
    title: activity.title,
    type: activity.type,
    time: formatTimeAgo(activity.createdAt),
  }));

  if (loading) {
    return (
      <SideMenu>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-agro-600 mx-auto mb-4"></div>
            <p className="text-neutral-600">Carregando estatísticas...</p>
          </div>
        </div>
      </SideMenu>
    );
  }

  if (error) {
    return (
      <SideMenu>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600 mb-4">
              Erro ao carregar estatísticas: {error}
            </p>
            <button onClick={() => refreshStatistics()} className="btn-primary">
              Tentar novamente
            </button>
          </div>
        </div>
      </SideMenu>
    );
  }

  // 🎯 MUDANÇA 2: Adicionar o botão 'Pular' dentro deste bloco de retorno
  if (shouldShowOnboarding) {
    return (
      <SideMenu>
        <div className="max-w-4xl mx-auto">
          <EmptyState
            title="Bem-vindo ao AgroSys!"
            description="Vamos configurar seu sistema para começar a gerenciar sua propriedade de forma eficiente."
            steps={setupSteps}
            icon={<FaTree />}
          />
          
          {/* NOVO CÓDIGO: Botão de Pular Configuração Inicial */}
          <div className="flex justify-end mt-4">
            <button 
              onClick={skipOnboarding} // Chama a função que criamos em useUserOnboarding.ts
              className="text-sm text-neutral-500 hover:text-agro-600 font-semibold transition-colors"
            >
              Pular Configuração Inicial
            </button>
          </div>
          {/* FIM NOVO CÓDIGO */}
          
        </div>
      </SideMenu>
    );
  }

  return (
// ... (restante do código)
    <SideMenu>
      <div className="space-y-6">
        {/* KPIs Principais - Linha do Topo */}
        <DashboardKPIs statistics={statistics} alertsCount={alerts.length} />

        {/* Layout Principal - 2/3 + 1/3 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna Esquerda - 2/3 da tela */}
          <div className="lg:col-span-2 space-y-6">
            {/* Gráfico de Produção Mensal */}
            <ProductionChart
              selectedPeriod={selectedPeriod}
              onPeriodChange={setSelectedPeriod}
              periodOptions={periodOptions}
            />

            {/* Próximas Atividades/Cronograma */}
            <UpcomingActivities activities={upcomingActivities} />
          </div>

          {/* Coluna Direita - 1/3 da tela */}
          <div className="space-y-6">
            {/* Centro de Alertas & Notificações */}
            <DashboardSidebar
              alerts={alerts}
              onShowHelp={() => setShowAlertsTutorial(true)}
              onMarkAlertAsRead={markAlertAsRead}
            />

            {/* Distribuição de Custos */}
            <CostDistribution data={costDistribution} />

            {/* Atividades Recentes */}
            <RecentActivities activities={recentActivityItems} />
          </div>
        </div>

        {/* System Info */}
        <SystemInfo />
      </div>

      {/* Tutorial de Alertas */}
      <AlertsTutorial
        isVisible={showAlertsTutorial}
        onClose={() => setShowAlertsTutorial(false)}
        onComplete={() => {
          setShowAlertsTutorial(false);
          markAlertsTutorialAsSeen();
        }}
      />
    </SideMenu>
  );
}

export default DashboardPage;









// import { FaTree } from "react-icons/fa";
// import { SideMenu } from "@/components/layout/SideMenu";
// import { EmptyState } from "@/components/ui/EmptyState";
// import { SystemInfo } from "@/components/ui/SystemInfo";
// import { AlertsTutorial } from "@/components/ui/AlertsTutorial";
// import { useDashboard } from "@/hooks/useDashboard";
// import { useAlerts } from "@/hooks/useAlerts";

// import { useUserOnboarding } from "@/hooks/useUserOnboarding";

// import { useOnboardingSteps } from "@/hooks/useOnboardingSteps";
// import { useDashboardData } from "@/hooks/useDashboardData";
// import { formatTimeAgo } from "@/utils/dateUtils";
// import { DashboardKPIs } from "@/components/dashboard/DashboardKPIs";
// import { UpcomingActivities } from "@/components/dashboard/UpcomingActivities";
// import { CostDistribution } from "@/components/dashboard/CostDistribution";
// import { RecentActivities } from "@/components/dashboard/RecentActivities";
// import { ProductionChart } from "@/components/dashboard/ProductionChart";
// import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
// import { useState, useEffect } from "react";

// export function DashboardPage() {
//   const { statistics, loading, error, refreshStatistics } = useDashboard();
//   const { alerts, recentActivities, markAlertAsRead } = useAlerts();
//   const { isNewUser, hasSeenAlertsTutorial, markAlertsTutorialAsSeen } =
//     useUserOnboarding();
//   const { setupSteps, allStepsCompleted } = useOnboardingSteps();
//   const { upcomingActivities, costDistribution, periodOptions } =
//     useDashboardData();
//   const [selectedPeriod, setSelectedPeriod] = useState("6months");
//   const [showAlertsTutorial, setShowAlertsTutorial] = useState(false);

//   // Mostrar tutorial para novos usuários que ainda não viram
//   useEffect(() => {
//     if (isNewUser && !hasSeenAlertsTutorial && alerts.length > 0) {
//       setShowAlertsTutorial(true);
//     }
//   }, [isNewUser, hasSeenAlertsTutorial, alerts.length]);

//   const shouldShowOnboarding = isNewUser && !allStepsCompleted;

//   const recentActivityItems = recentActivities.map((activity) => ({
//     id: activity.id,
//     title: activity.title,
//     type: activity.type,
//     time: formatTimeAgo(activity.createdAt),
//   }));

//   if (loading) {
//     return (
//       <SideMenu>
//         <div className="flex items-center justify-center h-64">
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-agro-600 mx-auto mb-4"></div>
//             <p className="text-neutral-600">Carregando estatísticas...</p>
//           </div>
//         </div>
//       </SideMenu>
//     );
//   }

//   if (error) {
//     return (
//       <SideMenu>
//         <div className="flex items-center justify-center h-64">
//           <div className="text-center">
//             <p className="text-red-600 mb-4">
//               Erro ao carregar estatísticas: {error}
//             </p>
//             <button onClick={() => refreshStatistics()} className="btn-primary">
//               Tentar novamente
//             </button>
//           </div>
//         </div>
//       </SideMenu>
//     );
//   }

//   if (shouldShowOnboarding) {
//     return (
//       <SideMenu>
//         <div className="max-w-4xl mx-auto">
//           <EmptyState
//             title="Bem-vindo ao AgroSys!"
//             description="Vamos configurar seu sistema para começar a gerenciar sua propriedade de forma eficiente."
//             steps={setupSteps}
//             icon={<FaTree />}
//           />
//         </div>
//       </SideMenu>
//     );
//   }

//   return (
//     <SideMenu>
//       <div className="space-y-6">
//         {/* KPIs Principais - Linha do Topo */}
//         <DashboardKPIs statistics={statistics} alertsCount={alerts.length} />

//         {/* Layout Principal - 2/3 + 1/3 */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Coluna Esquerda - 2/3 da tela */}
//           <div className="lg:col-span-2 space-y-6">
//             {/* Gráfico de Produção Mensal */}
//             <ProductionChart
//               selectedPeriod={selectedPeriod}
//               onPeriodChange={setSelectedPeriod}
//               periodOptions={periodOptions}
//             />

//             {/* Próximas Atividades/Cronograma */}
//             <UpcomingActivities activities={upcomingActivities} />
//           </div>

//           {/* Coluna Direita - 1/3 da tela */}
//           <div className="space-y-6">
//             {/* Centro de Alertas & Notificações */}
//             <DashboardSidebar
//               alerts={alerts}
//               onShowHelp={() => setShowAlertsTutorial(true)}
//               onMarkAlertAsRead={markAlertAsRead}
//             />

//             {/* Distribuição de Custos */}
//             <CostDistribution data={costDistribution} />

//             {/* Atividades Recentes */}
//             <RecentActivities activities={recentActivityItems} />
//           </div>
//         </div>

//         {/* System Info */}
//         <SystemInfo />
//       </div>

//       {/* Tutorial de Alertas */}
//       <AlertsTutorial
//         isVisible={showAlertsTutorial}
//         onClose={() => setShowAlertsTutorial(false)}
//         onComplete={() => {
//           setShowAlertsTutorial(false);
//           markAlertsTutorialAsSeen();
//         }}
//       />
//     </SideMenu>
//   );
// }

// export default DashboardPage;
