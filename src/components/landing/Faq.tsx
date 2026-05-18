import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { config } from "@/lib/config"

const faqItems = [
    {
        question: "Quais convênios vocês aceitam?",
        answer: (
            <>
                <p>Atendemos os principais planos como <strong>Unimed, Bradesco, SulAmérica, Amil, IPSM, Cassi</strong>, entre outros.</p>
                <p style={{ marginTop: '10px' }}>Quer ter certeza absoluta? <a href={`${config.whatsappLink}&text=Olá,%20gostaria%20de%20saber%20se%20aceitam%20meu%20plano.`} target="_blank" rel="noopener noreferrer" aria-label="Enviar foto da carteirinha pelo WhatsApp para consultar cobertura" style={{ color: 'var(--accent)', fontWeight: 'bold' }}>Envie uma foto da sua carteirinha no WhatsApp</a> e nossa equipe verifica a cobertura na hora para você.</p>
            </>
        )
    },
    {
        question: "O exame do sono pode ser feito em casa?",
        answer: (
            <>
                <p><strong>Sim!</strong> Esse é um dos nossos diferenciais. Levamos o equipamento até sua residência, instalamos e buscamos no dia seguinte.</p>
                <p>É a opção ideal para idosos, pessoas com mobilidade reduzida ou para quem quer mais conforto. <a href={`${config.whatsappLink}&text=Tenho%20interesse%20no%20exame%20domiciliar.`} target="_blank" rel="noopener noreferrer" aria-label="Verificar disponibilidade de exame domiciliar por bairro no WhatsApp" style={{ color: 'var(--accent)', fontWeight: 'bold' }}>Verifique a disponibilidade para seu bairro aqui.</a></p>
            </>
        )
    },
    {
        question: "Preciso de pedido médico para agendar?",
        answer: (
             <p>Para realizar exames pelo convênio, sim, o pedido médico é obrigatório. Se for particular, não necessariamente. <br/><br/>Caso você não tenha o pedido, pode agendar uma <strong>consulta inicial</strong> com nossos especialistas (Neurologista ou Médico do Sono) que eles farão a avaliação completa.</p>
        )
    },
    {
        question: "Vocês emitem nota para reembolso?",
        answer: <p>Sim. Se o seu convênio não for credenciado conosco, você pode realizar o atendimento particular e nós emitimos toda a documentação necessária para você solicitar o reembolso ao seu plano de saúde.</p>
    },
    {
        question: "O exame em crianças dói ou incomoda?",
        answer: <p>Fique tranquilo(a). Todos os nossos exames (Polissonografia, EEG) são <strong>indolores e não invasivos</strong> (sem agulhas). Nossa equipe é treinada para deixar a criança super confortável e segura.</p>
    }
]


export default function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="py-12 md:py-20 bg-slate-50">
        <div className="container mx-auto px-5" style={{ maxWidth: '800px' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h2 id="faq-title" className="text-3xl font-extrabold text-[#0b2447] mb-2">Dúvidas Frequentes sobre Exames do Sono</h2>
                <p className="text-slate-500 text-sm sm:text-base leading-relaxed">Tire suas principais dúvidas sobre a realização de polissonografia, eletroencefalograma, convênios aceitos e exames domiciliares em Belo Horizonte.</p>
            </div>

            <Accordion type="single" collapsible className="w-full">
                {faqItems.map((item, index) => (
                    <AccordionItem key={index} value={`item-${index}`} className="faq-item border-b-0">
                        <AccordionTrigger className="faq-question">
                            {item.question}
                        </AccordionTrigger>
                        <AccordionContent className="faq-answer">
                            {item.answer}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    </section>
  )
}
