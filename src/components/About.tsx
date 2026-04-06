import Image from "next/image";
import { CheckCircle } from "lucide-react";
import { contacts } from "@/data/contacts";

export default function About() {
  const principles = [
    "Професіоналізм та відповідальність",
    "Домінування інтересів клієнта",
    "Робота до одержання обумовленого результату",
    "Гарантії якості, своєчасності та конфіденційності",
    "Індивідуальний підхід до кожної справи",
  ];

  return (
    <section id="about" className="section-bg py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <div className="glass shadow-[0_0_40px_rgba(30,58,138,0.15)] p-2 md:p-4 max-w-md mx-auto lg:mx-0">
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden">
              <Image
                src="/images/photo.jpg"
                alt={contacts.name}
                fill
                className="object-cover"
              />
            </div>
          </div>

          <div>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-[var(--color-foreground)] mb-4">
              Про <span className="gold-gradient">адвоката</span>
            </h2>
            <p className="text-xl text-[var(--color-accent)] font-medium mb-6">
              {contacts.name}
            </p>
            <p className="text-[var(--color-muted)] leading-relaxed mb-6">
              Успішна юридична практика із 2003 року. Спеціалізуюся у сфері
              цивільного, господарського, кримінального права, а також
              юридичного обслуговування бізнесу та фізичних осіб.
            </p>
            <p className="text-[var(--color-muted)] leading-relaxed mb-8">
              У кожній судовій справі та юридичній консультації прагну знайти
              найефективніший шлях до захисту інтересів клієнта. Використовую
              тільки законні та перевірені методи.
            </p>

            <h3 className="font-heading text-lg font-semibold text-[var(--color-foreground)] mb-4">
              Принципи роботи:
            </h3>
            <ul className="space-y-3">
              {principles.map((principle) => (
                <li
                  key={principle}
                  className="flex items-start gap-3 text-[var(--color-muted)]"
                >
                  <CheckCircle
                    size={18}
                    className="mt-0.5 flex-shrink-0"
                    style={{ color: "var(--color-accent)" }}
                  />
                  {principle}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
