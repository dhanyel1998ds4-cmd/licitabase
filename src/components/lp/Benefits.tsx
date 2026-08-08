import { CheckCircle2 } from "lucide-react";

export function Benefits() {
  const benefits = [
    {
      title: "Mais aderência",
      text: "Use filtros e alertas para reduzir o tempo gasto com licitações que não combinam com sua operação.",
      detail: "Concentre energia nas oportunidades que fazem sentido.",
    },
    {
      title: "Análise mais ágil",
      text: "Consulte dados, preços, concorrentes e informações do edital em um só ambiente.",
      detail: "Menos troca de ferramentas durante a análise.",
    },
    {
      title: "Prazos sob controle",
      text: "Centralize datas importantes, disputas próximas e oportunidades que exigem atenção.",
      detail: "Saiba o que precisa acontecer primeiro.",
    },
    {
      title: "Mais capacidade",
      text: "Automatize tarefas repetitivas e acompanhe mais oportunidades sem ampliar o trabalho manual na mesma proporção.",
      detail: "Escalone a operação com mais organização.",
    },
  ];

  return (
    <section className="py-20 bg-[#E9FBF4]">
      <div className="mx-auto max-w-[1200px] px-6 md:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#0B132B]">
            Mais oportunidades não precisam significar mais trabalho
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#00A86B] mb-6 shadow-sm">
                <CheckCircle2 size={24} />
              </div>
              <h3 className="text-lg font-bold text-[#0B132B]">{benefit.title}</h3>
              <p className="mt-3 text-sm text-[#667085] leading-relaxed">{benefit.text}</p>
              <p className="mt-2 text-xs text-[#667085]/80 font-medium leading-relaxed">{benefit.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
