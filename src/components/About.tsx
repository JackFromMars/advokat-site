import Image from "next/image";
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
    <section id="about" className="py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <div className="glass p-2 md:p-4 max-w-md mx-auto lg:mx-0">
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
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Про <span className="gold-gradient">адвоката</span>
            </h2>
            <p className="text-xl text-amber-400 font-medium mb-6">
              {contacts.name}
            </p>
            <p className="text-slate-300 leading-relaxed mb-6">
              Успішна юридична практика із 2003 року. Спеціалізуюся у сфері
              цивільного, господарського, кримінального права, а також
              юридичного обслуговування бізнесу та фізичних осіб.
            </p>
            <p className="text-slate-300 leading-relaxed mb-8">
              У кожній судовій справі та юридичній консультації прагну знайти
              найефективніший шлях до захисту інтересів клієнта. Використовую
              тільки законні та перевірені методи.
            </p>

            <h3 className="text-lg font-semibold text-white mb-4">
              Принципи роботи:
            </h3>
            <ul className="space-y-3">
              {principles.map((principle) => (
                <li
                  key={principle}
                  className="flex items-start gap-3 text-slate-300"
                >
                  <span className="text-amber-400 mt-0.5 flex-shrink-0">
                    ✓
                  </span>
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
