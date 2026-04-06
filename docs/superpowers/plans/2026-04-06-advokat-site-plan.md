# Сайт адвоката Левченко Н.В. — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Створити багатосторінковий сайт адвоката з Чернівців на Next.js з bento/glassmorphism дизайном, SEO-оптимізацією та інтеграціями (Telegram, Google Reviews, Google Maps).

**Architecture:** Next.js 14 App Router з SSG для всіх сторінок. Контент зберігається у JSON-файлах. API Routes для серверлес-функцій (Telegram, Google Places). Компонентна архітектура з єдиним шаблоном для сторінок послуг.

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS 4, Vercel, Google Places API, Telegram Bot API

---

## File Structure

```
advokat-site/
├── public/
│   ├── images/
│   │   ├── photo.jpg                    # Фото адвоката
│   │   └── og-image.jpg                 # Open Graph зображення
│   └── favicon.ico
├── src/
│   ├── app/
│   │   ├── layout.tsx                   # Root layout: шрифти, метадані, Header/Footer/ChatWidget
│   │   ├── page.tsx                     # Головна сторінка
│   │   ├── globals.css                  # Tailwind директиви + glassmorphism утиліти
│   │   ├── [slug]/
│   │   │   └── page.tsx                 # Динамічна сторінка послуги (generateStaticParams)
│   │   ├── api/
│   │   │   ├── contact/
│   │   │   │   └── route.ts             # POST: відправка заявки в Telegram
│   │   │   └── reviews/
│   │   │       └── route.ts             # GET: Google Places Reviews (ISR fallback)
│   │   ├── sitemap.ts                   # Автогенерація sitemap.xml
│   │   └── robots.ts                    # robots.txt
│   ├── components/
│   │   ├── Header.tsx                   # Навігація + бургер-меню
│   │   ├── Hero.tsx                     # Hero-секція з формою
│   │   ├── Stats.tsx                    # Блок цифр з анімацією
│   │   ├── ServicesGrid.tsx             # Бенто-сітка основних + додаткових послуг
│   │   ├── About.tsx                    # Секція про адвоката
│   │   ├── Reviews.tsx                  # Карусель відгуків
│   │   ├── FAQ.tsx                      # Акордеон FAQ
│   │   ├── Map.tsx                      # Google Maps embed
│   │   ├── ContactForm.tsx              # Форма зв'язку + месенджери
│   │   ├── ChatWidget.tsx               # Плаваюча кнопка з меню
│   │   ├── Footer.tsx                   # Футер
│   │   ├── Breadcrumbs.tsx              # Хлібні крихти
│   │   └── ServicePageContent.tsx       # Контент шаблону сторінки послуги
│   ├── data/
│   │   ├── contacts.ts                  # Контактні дані
│   │   ├── stats.ts                     # Цифри для статистики
│   │   ├── navigation.ts               # Пункти навігації
│   │   ├── faq.ts                       # Загальні FAQ
│   │   └── services/
│   │       ├── index.ts                 # Список всіх послуг + утиліти
│   │       ├── simejni-spravy.ts
│   │       ├── zhytlovi-superechky.ts
│   │       ├── mobilizatsiya.ts
│   │       ├── kredyty-ta-borhy.ts
│   │       ├── mihratsijne-pravo.ts
│   │       ├── korporatyvne-pravo.ts
│   │       ├── zemelne-ta-ahrarne-pravo.ts
│   │       └── administratyvni-spravy.ts
│   └── lib/
│       ├── telegram.ts                  # Відправка повідомлень у Telegram
│       ├── google-places.ts             # Отримання відгуків з Google Places
│       └── schema.ts                    # Генерація JSON-LD schema.org
├── .env.local                           # API ключі (не в git)
├── .env.example                         # Приклад змінних оточення
├── .gitignore
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── docs/
    └── superpowers/
        ├── specs/
        │   └── 2026-04-06-advokat-site-design.md
        └── plans/
            └── 2026-04-06-advokat-site-plan.md
```

---

## Task 1: Project Scaffolding + GitHub Repo

**Files:**
- Create: `package.json`, `next.config.ts`, `tailwind.config.ts`, `tsconfig.json`, `.gitignore`, `.env.example`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`

- [ ] **Step 1: Create Next.js project**

```bash
cd D:/advokat-site
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --no-import-alias --use-npm
```

When prompted, accept defaults. This creates the full Next.js scaffold.

- [ ] **Step 2: Verify project runs**

```bash
npm run dev
```

Expected: dev server starts on http://localhost:3000, default Next.js page renders.

- [ ] **Step 3: Clean default content**

Replace `src/app/page.tsx`:

```tsx
export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <h1 className="text-4xl font-bold">Адвокат Левченко Н.В.</h1>
    </main>
  );
}
```

Replace `src/app/globals.css`:

```css
@import "tailwindcss";

@layer base {
  body {
    @apply bg-slate-950 text-white antialiased;
  }
}

@layer utilities {
  .glass {
    @apply bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl;
  }

  .glass-hover {
    @apply hover:bg-white/10 hover:border-white/20 transition-all duration-300;
  }

  .gold-accent {
    @apply text-amber-400;
  }

  .gold-gradient {
    background: linear-gradient(135deg, #d4a843 0%, #f0d68a 50%, #d4a843 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
}
```

- [ ] **Step 4: Update layout.tsx with base metadata**

Replace `src/app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Адвокат у Чернівцях — Левченко Наталія Вікторівна",
    template: "%s | Адвокат Левченко Н.В.",
  },
  description:
    "Адвокат у Чернівцях з досвідом понад 23 роки. Сімейні справи, житлові суперечки, мобілізація. Професійний захист ваших інтересів.",
  metadataBase: new URL("https://advokat.jackmars.com.ua"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk">
      <body className={`${inter.variable} font-sans`}>{children}</body>
    </html>
  );
}
```

- [ ] **Step 5: Create .env.example**

Create `.env.example`:

```env
# Telegram Bot
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=

# Google Places
GOOGLE_PLACES_API_KEY=
GOOGLE_PLACE_ID=

# Google Analytics
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_GTM_ID=
```

- [ ] **Step 6: Update .gitignore**

Append to `.gitignore`:

```
.env.local
.env.*.local
```

- [ ] **Step 7: Verify dev server still works**

```bash
npm run dev
```

Expected: page shows "Адвокат Левченко Н.В." on dark background.

- [ ] **Step 8: Initialize git and push to GitHub**

```bash
cd D:/advokat-site
git init
git add .
git commit -m "feat: initial Next.js scaffold with Tailwind and base layout"
gh repo create advokat-site --public --source=. --push
```

Expected: repo created on GitHub, code pushed.

---

## Task 2: Data Layer — Contacts, Stats, Navigation

**Files:**
- Create: `src/data/contacts.ts`, `src/data/stats.ts`, `src/data/navigation.ts`

- [ ] **Step 1: Create contacts data**

Create `src/data/contacts.ts`:

```ts
export const contacts = {
  name: "Левченко Наталія Вікторівна",
  title: "Адвокат у Чернівцях",
  phone: "+38 (095) 376-54-46",
  phoneRaw: "+380953765446",
  email: "",
  address: "м. Чернівці, вул. Небесної Сотні, 19",
  googleMapsUrl: "https://maps.app.goo.gl/U7FVJpFtmP3DywDc6",
  googleMapsEmbed:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2643.5!2d25.9353!3d48.2908!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z0LIu0J3QtdCx0LXRgdC90L7RlyDQodC-0YLQvdGWLCAxOQ!5e0!3m2!1suk!2sua!4v1",
  messengers: {
    viber: "viber://chat?number=%2B380953765446",
    telegram: "https://t.me/donetskband",
    whatsapp: "https://wa.me/380953765446",
  },
  practiceStartYear: 2003,
};
```

- [ ] **Step 2: Create stats data**

Create `src/data/stats.ts`:

```ts
export const stats = [
  {
    value: "23+",
    label: "років досвіду",
    description: "Успішна практика з 2003 року",
  },
  {
    value: "1000+",
    label: "справ",
    description: "Успішно вирішених справ",
  },
  {
    value: "95%",
    label: "виграшних",
    description: "Відсоток позитивних рішень",
  },
  {
    value: "24/7",
    label: "на зв'язку",
    description: "Консультації у будь-який час",
  },
];
```

- [ ] **Step 3: Create navigation data**

Create `src/data/navigation.ts`:

```ts
export const navigation = {
  main: [
    { label: "Головна", href: "/" },
    { label: "Послуги", href: "/#services" },
    { label: "Про адвоката", href: "/#about" },
    { label: "Відгуки", href: "/#reviews" },
    { label: "Контакти", href: "/#contacts" },
  ],
  services: [
    { label: "Сімейні справи", href: "/simejni-spravy" },
    { label: "Житлові суперечки", href: "/zhytlovi-superechky" },
    { label: "Мобілізація", href: "/mobilizatsiya" },
    { label: "Кредити та борги", href: "/kredyty-ta-borhy" },
    { label: "Міграційне право", href: "/mihratsijne-pravo" },
    { label: "Корпоративне право", href: "/korporatyvne-pravo" },
    { label: "Земельне та аграрне право", href: "/zemelne-ta-ahrarne-pravo" },
    { label: "Адміністративні справи", href: "/administratyvni-spravy" },
  ],
};
```

- [ ] **Step 4: Commit**

```bash
git add src/data/contacts.ts src/data/stats.ts src/data/navigation.ts
git commit -m "feat: add data layer — contacts, stats, navigation"
```

---

## Task 3: Data Layer — Services

**Files:**
- Create: `src/data/services/index.ts`, `src/data/services/simejni-spravy.ts`, `src/data/services/zhytlovi-superechky.ts`, `src/data/services/mobilizatsiya.ts`, `src/data/services/kredyty-ta-borhy.ts`, `src/data/services/mihratsijne-pravo.ts`, `src/data/services/korporatyvne-pravo.ts`, `src/data/services/zemelne-ta-ahrarne-pravo.ts`, `src/data/services/administratyvni-spravy.ts`

- [ ] **Step 1: Create service type and index**

Create `src/data/services/index.ts`:

```ts
export interface SubService {
  title: string;
  description: string;
}

export interface ServiceFAQ {
  question: string;
  answer: string;
}

export interface Service {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  metaDescription: string;
  icon: string;
  isPrimary: boolean;
  subServices: SubService[];
  faq: ServiceFAQ[];
}

import { simejniSpravy } from "./simejni-spravy";
import { zhytloviSuperechky } from "./zhytlovi-superechky";
import { mobilizatsiya } from "./mobilizatsiya";
import { kredytyTaBorhy } from "./kredyty-ta-borhy";
import { mihratsijnePravo } from "./mihratsijne-pravo";
import { korporatyvnePravo } from "./korporatyvne-pravo";
import { zemelneTaAhrarnePravo } from "./zemelne-ta-ahrarne-pravo";
import { administratyvniSpravy } from "./administratyvni-spravy";

export const services: Service[] = [
  simejniSpravy,
  zhytloviSuperechky,
  mobilizatsiya,
  kredytyTaBorhy,
  mihratsijnePravo,
  korporatyvnePravo,
  zemelneTaAhrarnePravo,
  administratyvniSpravy,
];

export const primaryServices = services.filter((s) => s.isPrimary);
export const secondaryServices = services.filter((s) => !s.isPrimary);

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}
```

- [ ] **Step 2: Create simejni-spravy.ts**

Create `src/data/services/simejni-spravy.ts`:

```ts
import { Service } from "./index";

export const simejniSpravy: Service = {
  slug: "simejni-spravy",
  title: "Сімейні справи",
  shortTitle: "Сімейні справи",
  description:
    "Професійний захист ваших інтересів у сімейних спорах. Розлучення, аліменти, поділ майна, встановлення батьківства — досвід понад 23 роки.",
  metaDescription:
    "Адвокат по сімейних справах у Чернівцях. Розлучення, аліменти, спори про дітей, поділ майна. Досвід понад 23 роки. Безкоштовна консультація.",
  icon: "👨‍👩‍👧‍👦",
  isPrimary: true,
  subServices: [
    {
      title: "Розірвання шлюбу",
      description:
        "Супровід процедури розлучення — від подання заяви до отримання рішення суду. Захист ваших інтересів при поділі майна та визначенні місця проживання дітей.",
    },
    {
      title: "Стягнення аліментів",
      description:
        "Стягнення всіх видів аліментів: на дітей, на утримання одного з подружжя, на батьків. Примусове виконання рішень.",
    },
    {
      title: "Спори про дітей",
      description:
        "Визначення місця проживання дитини, порядку спілкування з дитиною, позбавлення батьківських прав.",
    },
    {
      title: "Встановлення та оскарження батьківства",
      description:
        "Юридичний супровід процедури встановлення або оскарження батьківства в судовому порядку.",
    },
    {
      title: "Спадкове право",
      description:
        "Оформлення спадщини, оскарження заповіту, поділ спадкового майна між спадкоємцями.",
    },
  ],
  faq: [
    {
      question: "Скільки коштує розлучення через суд?",
      answer:
        "Вартість залежить від складності справи — наявності спільного майна, дітей, згоди другого з подружжя. На першій безкоштовній консультації я оціню вашу ситуацію та назву точну вартість.",
    },
    {
      question: "Як швидко можна розлучитися?",
      answer:
        "При згоді обох сторін та відсутності спільних неповнолітніх дітей — від 1 місяця. У судовому порядку — від 2 до 6 місяців залежно від складності.",
    },
    {
      question: "Чи можна стягнути аліменти без розлучення?",
      answer:
        "Так, закон дозволяє стягувати аліменти на утримання дітей навіть перебуваючи у шлюбі, якщо один з батьків не бере участі у утриманні дитини.",
    },
  ],
};
```

- [ ] **Step 3: Create zhytlovi-superechky.ts**

Create `src/data/services/zhytlovi-superechky.ts`:

```ts
import { Service } from "./index";

export const zhytloviSuperechky: Service = {
  slug: "zhytlovi-superechky",
  title: "Житлові суперечки",
  shortTitle: "Житлові суперечки",
  description:
    "Вирішення житлових спорів: розподіл майна, виселення, вселення, зняття з реєстрації. Захист вашого права на житло.",
  metaDescription:
    "Адвокат з житлових спорів у Чернівцях. Розподіл майна, виселення, спадщина на нерухомість. Досвід понад 23 роки.",
  icon: "🏠",
  isPrimary: true,
  subServices: [
    {
      title: "Розподіл майна подружжя",
      description:
        "Поділ спільно нажитого майна при розлученні — квартири, будинки, земельні ділянки.",
    },
    {
      title: "Виселення та вселення в житло",
      description:
        "Захист права на житло, примусове виселення незаконно проживаючих осіб, вселення у спірне житло.",
    },
    {
      title: "Зняття з реєстрації місця мешкання",
      description:
        "Зняття з реєстрації осіб, які фактично не проживають за адресою, через суд.",
    },
    {
      title: "Спадщина на нерухомість",
      description:
        "Оформлення спадщини на квартиру, будинок, земельну ділянку. Поділ спадкового майна між спадкоємцями.",
    },
    {
      title: "Поновлення строків на прийняття спадщини",
      description:
        "Поновлення пропущеного строку для прийняття спадщини через суд при наявності поважних причин.",
    },
  ],
  faq: [
    {
      question: "Як виселити людину з квартири?",
      answer:
        "Виселення можливе лише за рішенням суду. Потрібно довести, що особа втратила право на проживання. На консультації оціню перспективи вашої справи.",
    },
    {
      question: "Чи можна поділити квартиру при розлученні?",
      answer:
        "Так, якщо квартира є спільною сумісною власністю подружжя (придбана під час шлюбу). Поділ здійснюється порівну або з урахуванням інтересів дітей.",
    },
  ],
};
```

- [ ] **Step 4: Create mobilizatsiya.ts**

Create `src/data/services/mobilizatsiya.ts`:

```ts
import { Service } from "./index";

export const mobilizatsiya: Service = {
  slug: "mobilizatsiya",
  title: "Мобілізація",
  shortTitle: "Мобілізація",
  description:
    "Правовий захист з питань мобілізації: відстрочки, військовий облік, перетин кордону, оскарження незаконних дій ТЦК.",
  metaDescription:
    "Військовий адвокат у Чернівцях. Відстрочка від мобілізації, перетин кордону, оскарження дій ТЦК. Юридична допомога з питань військового обліку.",
  icon: "🛡️",
  isPrimary: true,
  subServices: [
    {
      title: "Перетин кордону військовозобов'язаними",
      description:
        "Юридичний супровід законного перетину кордону для військовозобов'язаних. Аналіз підстав та підготовка документів.",
    },
    {
      title: "Військовий облік",
      description:
        "Правова допомога з питань постановки на військовий облік, зняття та виключення з обліку.",
    },
    {
      title: "Незаконна мобілізація",
      description:
        "Оскарження незаконних дій ТЦК та СП. Захист прав військовозобов'язаних при порушенні процедури мобілізації.",
    },
    {
      title: "Оформлення відстрочки",
      description:
        "Допомога в оформленні відстрочки від мобілізації за наявності законних підстав.",
    },
  ],
  faq: [
    {
      question: "Які підстави для відстрочки від мобілізації?",
      answer:
        "Підстави визначені законом: бронювання від роботодавця, стан здоров'я, догляд за членами сім'ї з інвалідністю, багатодітність та інші. На консультації проаналізую вашу ситуацію.",
    },
    {
      question: "Що робити, якщо вручили повістку?",
      answer:
        "Після отримання повістки потрібно з'явитися до ТЦК у визначений строк. Але ви маєте право на адвоката на кожному етапі. Зверніться якнайшвидше для захисту ваших прав.",
    },
  ],
};
```

- [ ] **Step 5: Create kredyty-ta-borhy.ts**

Create `src/data/services/kredyty-ta-borhy.ts`:

```ts
import { Service } from "./index";

export const kredytyTaBorhy: Service = {
  slug: "kredyty-ta-borhy",
  title: "Кредити та борги",
  shortTitle: "Кредити та борги",
  description:
    "Захист прав позичальників. Реструктуризація кредитів, списання боргів, оскарження незаконних нарахувань банків та колекторів.",
  metaDescription:
    "Адвокат по кредитах у Чернівцях. Захист від колекторів, реструктуризація кредитів, списання боргів. Безкоштовна консультація.",
  icon: "💰",
  isPrimary: false,
  subServices: [
    {
      title: "Захист від колекторів",
      description:
        "Припинення незаконного тиску колекторських компаній. Оскарження їх дій у суді.",
    },
    {
      title: "Реструктуризація кредитів",
      description:
        "Перегляд умов кредитного договору, зменшення відсоткової ставки, розстрочка платежів.",
    },
    {
      title: "Списання боргів",
      description:
        "Визнання кредитного договору недійсним, списання незаконно нарахованих штрафів та пені.",
    },
  ],
  faq: [
    {
      question: "Чи можна не платити кредит?",
      answer:
        "Повністю уникнути зобов'язань неможливо, але є законні способи зменшити суму боргу, списати незаконні нарахування або домовитися про реструктуризацію.",
    },
  ],
};
```

- [ ] **Step 6: Create mihratsijne-pravo.ts**

Create `src/data/services/mihratsijne-pravo.ts`:

```ts
import { Service } from "./index";

export const mihratsijnePravo: Service = {
  slug: "mihratsijne-pravo",
  title: "Міграційне право",
  shortTitle: "Міграційне право",
  description:
    "Юридичний супровід міграційних питань: дозвіл на проживання, громадянство, легалізація перебування в Україні.",
  metaDescription:
    "Міграційний адвокат у Чернівцях. Дозвіл на проживання, громадянство, легалізація. Юридичний супровід іноземців.",
  icon: "✈️",
  isPrimary: false,
  subServices: [
    {
      title: "Дозвіл на проживання",
      description:
        "Оформлення тимчасового та постійного дозволу на проживання в Україні.",
    },
    {
      title: "Отримання громадянства",
      description:
        "Юридичний супровід процедури набуття громадянства України.",
    },
    {
      title: "Легалізація перебування",
      description:
        "Допомога у легалізації перебування іноземців на території України.",
    },
  ],
  faq: [
    {
      question: "Як отримати дозвіл на проживання в Україні?",
      answer:
        "Потрібні підстави: робота, навчання, возз'єднання сім'ї тощо. На консультації визначимо оптимальний шлях для вашої ситуації.",
    },
  ],
};
```

- [ ] **Step 7: Create korporatyvne-pravo.ts**

Create `src/data/services/korporatyvne-pravo.ts`:

```ts
import { Service } from "./index";

export const korporatyvnePravo: Service = {
  slug: "korporatyvne-pravo",
  title: "Корпоративне та господарське право",
  shortTitle: "Корпоративне право",
  description:
    "Юридичне обслуговування бізнесу: реєстрація, супровід діяльності, господарські спори, отримання ліцензій.",
  metaDescription:
    "Корпоративний адвокат у Чернівцях. Реєстрація бізнесу, господарські спори, отримання ліцензій. Абонентське юридичне обслуговування.",
  icon: "🏢",
  isPrimary: false,
  subServices: [
    {
      title: "Господарські спори",
      description:
        "Представництво у господарських судах, захист інтересів підприємства у спорах з контрагентами.",
    },
    {
      title: "Абонентське юридичне обслуговування",
      description:
        "Постійний юридичний супровід бізнесу: консультації, договори, претензії, суди.",
    },
    {
      title: "Допомога в отриманні ліцензії",
      description:
        "Підготовка документів та супровід процедури отримання ліцензій на різні види діяльності.",
    },
  ],
  faq: [
    {
      question: "Що включає абонентське обслуговування?",
      answer:
        "Щомісячна юридична підтримка: консультації, перевірка договорів, претензійна робота, представництво в суді. Умови та вартість обговорюються індивідуально.",
    },
  ],
};
```

- [ ] **Step 8: Create zemelne-ta-ahrarne-pravo.ts**

Create `src/data/services/zemelne-ta-ahrarne-pravo.ts`:

```ts
import { Service } from "./index";

export const zemelneTaAhrarnePravo: Service = {
  slug: "zemelne-ta-ahrarne-pravo",
  title: "Земельне та аграрне право",
  shortTitle: "Земельне право",
  description:
    "Вирішення земельних спорів, оформлення права власності на землю, супровід земельних угод.",
  metaDescription:
    "Земельний адвокат у Чернівцях. Земельні спори, оформлення власності на землю, аграрне право. Досвід понад 23 роки.",
  icon: "🌾",
  isPrimary: false,
  subServices: [
    {
      title: "Земельні спори",
      description:
        "Вирішення спорів щодо меж земельних ділянок, самовільного захоплення землі, сервітутів.",
    },
    {
      title: "Оформлення права власності",
      description:
        "Приватизація земельних ділянок, оформлення права власності, реєстрація в Держгеокадастрі.",
    },
    {
      title: "Аграрне право",
      description:
        "Юридичний супровід діяльності фермерських господарств, оренда сільськогосподарських земель.",
    },
  ],
  faq: [
    {
      question: "Як оформити землю у власність?",
      answer:
        "Процедура залежить від підстави: приватизація, спадщина, купівля. Потрібна технічна документація, реєстрація в Держгеокадастрі та внесення до реєстру прав. Супроводжу весь процес.",
    },
  ],
};
```

- [ ] **Step 9: Create administratyvni-spravy.ts**

Create `src/data/services/administratyvni-spravy.ts`:

```ts
import { Service } from "./index";

export const administratyvniSpravy: Service = {
  slug: "administratyvni-spravy",
  title: "Адміністративні та пенсійні справи",
  shortTitle: "Адміністративні справи",
  description:
    "Захист прав громадян у відносинах з державними органами. Оскарження рішень, пенсійні спори.",
  metaDescription:
    "Адвокат по адміністративних справах у Чернівцях. Оскарження рішень держорганів, пенсійні спори. Захист прав громадян.",
  icon: "⚖️",
  isPrimary: false,
  subServices: [
    {
      title: "Оскарження рішень держорганів",
      description:
        "Оскарження незаконних рішень, дій чи бездіяльності органів державної влади та місцевого самоврядування.",
    },
    {
      title: "Пенсійні справи",
      description:
        "Захист пенсійних прав: перерахунок пенсії, оскарження відмов Пенсійного фонду, призначення пенсії.",
    },
    {
      title: "Адміністративні правопорушення",
      description:
        "Захист інтересів при складанні протоколів про адміністративні правопорушення та в суді.",
    },
  ],
  faq: [
    {
      question: "Як оскаржити рішення Пенсійного фонду?",
      answer:
        "Рішення ПФУ оскаржується в адміністративному суді протягом 6 місяців з дня, коли ви дізналися про порушення. Потрібно зібрати докази та правильно обґрунтувати позов.",
    },
  ],
};
```

- [ ] **Step 10: Verify TypeScript compiles**

```bash
cd D:/advokat-site && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 11: Commit**

```bash
git add src/data/
git commit -m "feat: add services data layer with 8 service categories"
```

---

## Task 4: Data Layer — FAQ + Schema.org utilities

**Files:**
- Create: `src/data/faq.ts`, `src/lib/schema.ts`

- [ ] **Step 1: Create general FAQ data**

Create `src/data/faq.ts`:

```ts
export interface FAQItem {
  question: string;
  answer: string;
}

export const generalFAQ: FAQItem[] = [
  {
    question: "Скільки коштує консультація адвоката?",
    answer:
      "Перша консультація — безкоштовна. На ній я оціню вашу ситуацію, визначу перспективи справи та назву вартість послуг. Без прихованих платежів.",
  },
  {
    question: "Як записатися на консультацію?",
    answer:
      "Зателефонуйте, напишіть у Telegram, Viber або WhatsApp, або залиште заявку на сайті — я зв'яжуся протягом години у робочий час.",
  },
  {
    question: "Чи працюєте ви дистанційно?",
    answer:
      "Так, проводжу онлайн-консультації через відеозв'язок. Документи можна надіслати електронно. Працюю з клієнтами по всій Україні.",
  },
  {
    question: "Який ваш досвід роботи?",
    answer:
      "Практикую з 2003 року — понад 23 роки досвіду. Спеціалізуюся на сімейних справах, житлових суперечках та питаннях мобілізації.",
  },
  {
    question: "Чи надаєте ви гарантію результату?",
    answer:
      "Жоден адвокат не може гарантувати конкретний результат — це заборонено законом. Але я гарантую максимальні зусилля, прозорість та роботу до досягнення обумовленого результату.",
  },
  {
    question: "Скільки часу займає судова справа?",
    answer:
      "Від 1 до 12 місяців залежно від категорії та складності. На першій консультації я оціню реалістичні строки саме для вашої ситуації.",
  },
];
```

- [ ] **Step 2: Create schema.org utility**

Create `src/lib/schema.ts`:

```ts
import { contacts } from "@/data/contacts";
import type { Service } from "@/data/services";
import type { FAQItem } from "@/data/faq";

export function generateLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["Attorney", "LocalBusiness"],
    name: contacts.name,
    description:
      "Адвокат у Чернівцях з досвідом понад 23 роки. Сімейні справи, житлові суперечки, мобілізація.",
    url: "https://advokat.jackmars.com.ua",
    telephone: contacts.phoneRaw,
    address: {
      "@type": "PostalAddress",
      streetAddress: "вул. Небесної Сотні, 19",
      addressLocality: "Чернівці",
      addressCountry: "UA",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 48.2908,
      longitude: 25.9353,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
    priceRange: "$$",
  };
}

export function generateFAQSchema(items: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function generateServiceSchema(service: Service) {
  return {
    "@context": "https://schema.org",
    "@type": "LegalService",
    name: service.title,
    description: service.description,
    provider: {
      "@type": "Attorney",
      name: contacts.name,
      telephone: contacts.phoneRaw,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Чернівці",
        addressCountry: "UA",
      },
    },
    areaServed: {
      "@type": "City",
      name: "Чернівці",
    },
  };
}
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
cd D:/advokat-site && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/data/faq.ts src/lib/schema.ts
git commit -m "feat: add FAQ data and schema.org JSON-LD generators"
```

---

## Task 5: Header + Footer Components

**Files:**
- Create: `src/components/Header.tsx`, `src/components/Footer.tsx`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Create Header component**

Create `src/components/Header.tsx`:

```tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { navigation } from "@/data/navigation";
import { contacts } from "@/data/contacts";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link href="/" className="flex flex-col">
            <span className="text-lg md:text-xl font-bold gold-gradient">
              Адвокат Левченко
            </span>
            <span className="text-xs text-slate-400 hidden sm:block">
              Наталія Вікторівна
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navigation.main.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-2 text-sm text-slate-300 hover:text-white transition-colors rounded-lg hover:bg-white/5"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <a
              href={`tel:${contacts.phoneRaw}`}
              className="text-sm text-amber-400 hover:text-amber-300 transition-colors font-medium"
            >
              {contacts.phone}
            </a>
          </div>

          <button
            type="button"
            className="md:hidden p-2 text-slate-300 hover:text-white"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Закрити меню" : "Відкрити меню"}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden glass border-t border-white/10">
          <div className="px-4 py-3 space-y-1">
            {navigation.main.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-3 py-3 text-base text-slate-300 hover:text-white rounded-lg hover:bg-white/5"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <a
              href={`tel:${contacts.phoneRaw}`}
              className="block px-3 py-3 text-base text-amber-400 font-medium"
            >
              {contacts.phone}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
```

- [ ] **Step 2: Create Footer component**

Create `src/components/Footer.tsx`:

```tsx
import Link from "next/link";
import { contacts } from "@/data/contacts";
import { navigation } from "@/data/navigation";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold gold-gradient mb-4">
              Адвокат Левченко Н.В.
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Професійний захист ваших інтересів з 2003 року. Сімейні справи,
              житлові суперечки, мобілізація.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
              Послуги
            </h4>
            <ul className="space-y-2">
              {navigation.services.slice(0, 5).map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
              Контакти
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <a
                  href={`tel:${contacts.phoneRaw}`}
                  className="hover:text-white transition-colors"
                >
                  {contacts.phone}
                </a>
              </li>
              <li>{contacts.address}</li>
              <li className="flex gap-4 pt-2">
                <a
                  href={contacts.messengers.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Telegram
                </a>
                <a
                  href={contacts.messengers.viber}
                  className="hover:text-white transition-colors"
                >
                  Viber
                </a>
                <a
                  href={contacts.messengers.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/10 text-center text-sm text-slate-500">
          © {currentYear} {contacts.name}. Усі права захищені.
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 3: Update layout.tsx to include Header and Footer**

Replace `src/app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { generateLocalBusinessSchema } from "@/lib/schema";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Адвокат у Чернівцях — Левченко Наталія Вікторівна",
    template: "%s | Адвокат Левченко Н.В.",
  },
  description:
    "Адвокат у Чернівцях з досвідом понад 23 роки. Сімейні справи, житлові суперечки, мобілізація. Професійний захист ваших інтересів.",
  metadataBase: new URL("https://advokat.jackmars.com.ua"),
  openGraph: {
    type: "website",
    locale: "uk_UA",
    siteName: "Адвокат Левченко Н.В.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateLocalBusinessSchema()),
          }}
        />
      </head>
      <body className={`${inter.variable} font-sans`}>
        <Header />
        <main className="pt-16 md:pt-20">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

- [ ] **Step 4: Verify dev server renders Header and Footer**

```bash
cd D:/advokat-site && npm run dev
```

Expected: page shows header with navigation and gold logo at top, footer with contacts at bottom.

- [ ] **Step 5: Commit**

```bash
git add src/components/Header.tsx src/components/Footer.tsx src/app/layout.tsx
git commit -m "feat: add Header with mobile burger menu and Footer"
```

---

## Task 6: Hero Section

**Files:**
- Create: `src/components/Hero.tsx`, `src/components/ContactForm.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Create ContactForm component**

Create `src/components/ContactForm.tsx`:

```tsx
"use client";

import { useState } from "react";

interface ContactFormProps {
  variant?: "hero" | "section";
}

export default function ContactForm({ variant = "section" }: ContactFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone }),
      });

      if (res.ok) {
        setStatus("sent");
        setName("");
        setPhone("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className={`glass p-6 text-center ${variant === "hero" ? "max-w-sm" : ""}`}>
        <div className="text-3xl mb-2">✓</div>
        <p className="text-white font-medium">Дякую за звернення!</p>
        <p className="text-slate-400 text-sm mt-1">
          Зв'яжуся з вами протягом години
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`glass p-6 space-y-4 ${variant === "hero" ? "max-w-sm" : "max-w-lg mx-auto"}`}
    >
      <h3 className="text-lg font-semibold text-white">
        {variant === "hero"
          ? "Безкоштовна консультація"
          : "Залиште заявку — зателефоную протягом години"}
      </h3>
      <input
        type="text"
        placeholder="Ваше ім'я"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/50 transition-colors"
      />
      <input
        type="tel"
        placeholder="Ваш телефон"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        required
        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/50 transition-colors"
      />
      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full py-3 px-6 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold rounded-xl transition-colors disabled:opacity-50 min-h-[44px]"
      >
        {status === "sending"
          ? "Надсилаю..."
          : "Отримати безкоштовну консультацію"}
      </button>
      {status === "error" && (
        <p className="text-red-400 text-sm text-center">
          Помилка. Зателефонуйте нам напряму.
        </p>
      )}
    </form>
  );
}
```

- [ ] **Step 2: Create Hero component**

Create `src/components/Hero.tsx`:

```tsx
import Image from "next/image";
import { contacts } from "@/data/contacts";
import ContactForm from "./ContactForm";

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <div className="text-center lg:text-left">
            <p className="text-amber-400 font-medium mb-4 text-sm uppercase tracking-wider">
              Адвокат у Чернівцях з 2003 року
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Захищу ваші права{" "}
              <span className="gold-gradient">професійно</span> та{" "}
              <span className="gold-gradient">результативно</span>
            </h1>
            <p className="text-lg text-slate-300 mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">
              Юридичні проблеми не чекають — і я теж. Від першої консультації до
              рішення суду на вашому боці. Понад 23 роки успішної практики.
            </p>

            <div className="flex items-center justify-center lg:justify-start gap-4 mb-8">
              <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-amber-400/30">
                <Image
                  src="/images/photo.jpg"
                  alt={contacts.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="text-left">
                <p className="text-white font-semibold">{contacts.name}</p>
                <p className="text-slate-400 text-sm">Адвокат • з 2003 року</p>
              </div>
            </div>

            <a
              href={`tel:${contacts.phoneRaw}`}
              className="lg:hidden inline-flex items-center gap-2 py-3 px-6 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold rounded-xl transition-colors min-h-[44px]"
            >
              📞 Зателефонувати
            </a>
          </div>

          <div className="hidden lg:block">
            <ContactForm variant="hero" />
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Update page.tsx to render Hero**

Replace `src/app/page.tsx`:

```tsx
import Hero from "@/components/Hero";

export default function Home() {
  return (
    <>
      <Hero />
    </>
  );
}
```

- [ ] **Step 4: Add placeholder photo**

Download the photo from the old site and save as `public/images/photo.jpg`. If unavailable, create a placeholder:

```bash
cd D:/advokat-site && mkdir -p public/images
```

Copy the photo from the old website or create a placeholder image at `public/images/photo.jpg`.

- [ ] **Step 5: Verify Hero renders on mobile and desktop**

```bash
cd D:/advokat-site && npm run dev
```

Expected: Hero section with headline, lawyer info, and form (desktop) or call button (mobile).

- [ ] **Step 6: Commit**

```bash
git add src/components/Hero.tsx src/components/ContactForm.tsx src/app/page.tsx public/images/
git commit -m "feat: add Hero section with contact form and mobile CTA"
```

---

## Task 7: Stats + ServicesGrid Components

**Files:**
- Create: `src/components/Stats.tsx`, `src/components/ServicesGrid.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Create Stats component**

Create `src/components/Stats.tsx`:

```tsx
import { stats } from "@/data/stats";

export default function Stats() {
  return (
    <section className="py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="glass glass-hover p-6 text-center"
            >
              <div className="text-3xl md:text-4xl font-bold gold-gradient mb-2">
                {stat.value}
              </div>
              <div className="text-white font-medium text-sm md:text-base">
                {stat.label}
              </div>
              <div className="text-slate-400 text-xs mt-1 hidden md:block">
                {stat.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Create ServicesGrid component**

Create `src/components/ServicesGrid.tsx`:

```tsx
import Link from "next/link";
import { primaryServices, secondaryServices } from "@/data/services";

export default function ServicesGrid() {
  return (
    <section id="services" className="py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Основні <span className="gold-gradient">послуги</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Спеціалізуюся на найбільш затребуваних напрямках юридичної практики
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {primaryServices.map((service) => (
            <Link
              key={service.slug}
              href={`/${service.slug}`}
              className="glass glass-hover p-6 md:p-8 group"
            >
              <div className="text-4xl mb-4">{service.icon}</div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-amber-400 transition-colors">
                {service.title}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                {service.description}
              </p>
              <ul className="space-y-1.5">
                {service.subServices.slice(0, 3).map((sub) => (
                  <li
                    key={sub.title}
                    className="text-xs text-slate-500 flex items-start gap-2"
                  >
                    <span className="text-amber-400/60 mt-0.5">•</span>
                    {sub.title}
                  </li>
                ))}
              </ul>
              <div className="mt-4 text-amber-400 text-sm font-medium group-hover:translate-x-1 transition-transform">
                Детальніше →
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mb-8">
          <h3 className="text-xl md:text-2xl font-bold text-white">
            Також допоможу з
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {secondaryServices.map((service) => (
            <Link
              key={service.slug}
              href={`/${service.slug}`}
              className="glass glass-hover p-4 group text-center"
            >
              <div className="text-2xl mb-2">{service.icon}</div>
              <h4 className="text-sm font-semibold text-white group-hover:text-amber-400 transition-colors">
                {service.shortTitle}
              </h4>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Update page.tsx**

Replace `src/app/page.tsx`:

```tsx
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import ServicesGrid from "@/components/ServicesGrid";

export default function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <ServicesGrid />
    </>
  );
}
```

- [ ] **Step 4: Verify on dev server**

```bash
cd D:/advokat-site && npm run dev
```

Expected: Hero → Stats (4 cards in grid) → Services (3 primary bento cards + 5 compact secondary cards).

- [ ] **Step 5: Commit**

```bash
git add src/components/Stats.tsx src/components/ServicesGrid.tsx src/app/page.tsx
git commit -m "feat: add Stats and ServicesGrid bento components"
```

---

## Task 8: About + FAQ Components

**Files:**
- Create: `src/components/About.tsx`, `src/components/FAQ.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Create About component**

Create `src/components/About.tsx`:

```tsx
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
```

- [ ] **Step 2: Create FAQ component**

Create `src/components/FAQ.tsx`:

```tsx
"use client";

import { useState } from "react";
import type { FAQItem } from "@/data/faq";

interface FAQProps {
  items: FAQItem[];
  title?: string;
}

export default function FAQ({
  items,
  title = "Часті питання",
}: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-16 md:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
          {title.split(" ").slice(0, -1).join(" ")}{" "}
          <span className="gold-gradient">
            {title.split(" ").slice(-1)[0]}
          </span>
        </h2>

        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={index} className="glass overflow-hidden">
              <button
                type="button"
                className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 min-h-[44px]"
                onClick={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
                aria-expanded={openIndex === index}
              >
                <span className="text-white font-medium text-sm md:text-base">
                  {item.question}
                </span>
                <span
                  className={`text-amber-400 flex-shrink-0 transition-transform duration-200 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                >
                  ▾
                </span>
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4">
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Update page.tsx**

Replace `src/app/page.tsx`:

```tsx
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import ServicesGrid from "@/components/ServicesGrid";
import About from "@/components/About";
import FAQ from "@/components/FAQ";
import { generalFAQ } from "@/data/faq";
import { generateFAQSchema } from "@/lib/schema";

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateFAQSchema(generalFAQ)),
        }}
      />
      <Hero />
      <Stats />
      <ServicesGrid />
      <About />
      <FAQ items={generalFAQ} />
    </>
  );
}
```

- [ ] **Step 4: Verify**

```bash
cd D:/advokat-site && npm run dev
```

Expected: full scrollable page with all sections. FAQ accordion opens/closes on click.

- [ ] **Step 5: Commit**

```bash
git add src/components/About.tsx src/components/FAQ.tsx src/app/page.tsx
git commit -m "feat: add About section and FAQ accordion with schema.org"
```

---

## Task 9: Map + Contact Section + ChatWidget

**Files:**
- Create: `src/components/Map.tsx`, `src/components/ChatWidget.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Create Map component**

Create `src/components/Map.tsx`:

```tsx
import { contacts } from "@/data/contacts";

export default function Map() {
  return (
    <section className="py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Як <span className="gold-gradient">знайти</span>
          </h2>
          <a
            href={contacts.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-amber-400 transition-colors"
          >
            {contacts.address}
          </a>
        </div>

        <div className="glass p-2 overflow-hidden">
          <iframe
            src={contacts.googleMapsEmbed}
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Офіс адвоката на карті"
            className="rounded-xl"
          />
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Create ChatWidget component**

Create `src/components/ChatWidget.tsx`:

```tsx
"use client";

import { useState } from "react";
import { contacts } from "@/data/contacts";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  const channels = [
    {
      label: "Telegram",
      href: contacts.messengers.telegram,
      icon: "💬",
      color: "hover:bg-sky-500/20",
    },
    {
      label: "Viber",
      href: contacts.messengers.viber,
      icon: "📱",
      color: "hover:bg-purple-500/20",
    },
    {
      label: "WhatsApp",
      href: contacts.messengers.whatsapp,
      icon: "📲",
      color: "hover:bg-green-500/20",
    },
    {
      label: "Зателефонувати",
      href: `tel:${contacts.phoneRaw}`,
      icon: "📞",
      color: "hover:bg-amber-500/20",
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="absolute bottom-16 right-0 glass p-3 mb-2 min-w-[200px] space-y-1">
          {channels.map((channel) => (
            <a
              key={channel.label}
              href={channel.href}
              target={channel.href.startsWith("http") ? "_blank" : undefined}
              rel={
                channel.href.startsWith("http")
                  ? "noopener noreferrer"
                  : undefined
              }
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-white text-sm font-medium transition-colors ${channel.color}`}
            >
              <span className="text-lg">{channel.icon}</span>
              {channel.label}
            </a>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-full shadow-lg shadow-amber-500/25 flex items-center justify-center transition-all hover:scale-105"
        aria-label="Зв'язатися з адвокатом"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </button>
    </div>
  );
}
```

- [ ] **Step 3: Add ChatWidget to layout.tsx**

Add import and component in `src/app/layout.tsx`. After `<Footer />`, add:

```tsx
import ChatWidget from "@/components/ChatWidget";
```

And in the body, after `<Footer />`:

```tsx
<ChatWidget />
```

- [ ] **Step 4: Update page.tsx with Map and contact section**

Replace `src/app/page.tsx`:

```tsx
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import ServicesGrid from "@/components/ServicesGrid";
import About from "@/components/About";
import FAQ from "@/components/FAQ";
import Map from "@/components/Map";
import ContactForm from "@/components/ContactForm";
import { generalFAQ } from "@/data/faq";
import { generateFAQSchema } from "@/lib/schema";

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateFAQSchema(generalFAQ)),
        }}
      />
      <Hero />
      <Stats />
      <ServicesGrid />
      <About />
      <FAQ items={generalFAQ} />
      <Map />
      <section id="contacts" className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Зв&#39;яжіться <span className="gold-gradient">зі мною</span>
            </h2>
          </div>
          <ContactForm variant="section" />
        </div>
      </section>
    </>
  );
}
```

- [ ] **Step 5: Verify full homepage**

```bash
cd D:/advokat-site && npm run dev
```

Expected: full homepage with all sections + floating chat widget in bottom-right corner.

- [ ] **Step 6: Commit**

```bash
git add src/components/Map.tsx src/components/ChatWidget.tsx src/app/layout.tsx src/app/page.tsx
git commit -m "feat: add Map, contact section, and ChatWidget"
```

---

## Task 10: Service Pages (Dynamic Routes)

**Files:**
- Create: `src/app/[slug]/page.tsx`, `src/components/Breadcrumbs.tsx`, `src/components/ServicePageContent.tsx`

- [ ] **Step 1: Create Breadcrumbs component**

Create `src/components/Breadcrumbs.tsx`:

```tsx
import Link from "next/link";

interface BreadcrumbsProps {
  items: { label: string; href?: string }[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="py-4">
      <ol className="flex items-center gap-2 text-sm text-slate-400 flex-wrap">
        <li>
          <Link href="/" className="hover:text-white transition-colors">
            Головна
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            <span className="text-slate-600">/</span>
            {item.href ? (
              <Link
                href={item.href}
                className="hover:text-white transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-white">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
```

- [ ] **Step 2: Create ServicePageContent component**

Create `src/components/ServicePageContent.tsx`:

```tsx
import type { Service } from "@/data/services";
import Breadcrumbs from "./Breadcrumbs";
import FAQ from "./FAQ";
import ContactForm from "./ContactForm";

interface ServicePageContentProps {
  service: Service;
}

export default function ServicePageContent({
  service,
}: ServicePageContentProps) {
  return (
    <>
      <section className="pt-8 pb-16 md:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: service.title }]} />

          <div className="mt-8 mb-12">
            <div className="text-5xl mb-6">{service.icon}</div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              {service.title}
            </h1>
            <p className="text-lg text-slate-300 max-w-3xl leading-relaxed">
              {service.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {service.subServices.map((sub) => (
              <div key={sub.title} className="glass glass-hover p-6">
                <h2 className="text-lg font-semibold text-white mb-3">
                  {sub.title}
                </h2>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {sub.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {service.faq.length > 0 && (
        <FAQ items={service.faq} title="Часті питання" />
      )}

      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Потрібна <span className="gold-gradient">допомога</span>?
            </h2>
            <p className="text-slate-400">
              Залиште заявку — проконсультую безкоштовно
            </p>
          </div>
          <ContactForm variant="section" />
        </div>
      </section>
    </>
  );
}
```

- [ ] **Step 3: Create dynamic route page**

Create `src/app/[slug]/page.tsx`:

```tsx
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { services, getServiceBySlug } from "@/data/services";
import { generateServiceSchema, generateFAQSchema } from "@/lib/schema";
import ServicePageContent from "@/components/ServicePageContent";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return services.map((service) => ({
    slug: service.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};

  return {
    title: service.title,
    description: service.metaDescription,
    openGraph: {
      title: service.title,
      description: service.metaDescription,
    },
  };
}

export default async function ServicePage({ params }: PageProps) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateServiceSchema(service)),
        }}
      />
      {service.faq.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateFAQSchema(service.faq)),
          }}
        />
      )}
      <ServicePageContent service={service} />
    </>
  );
}
```

- [ ] **Step 4: Verify service pages**

```bash
cd D:/advokat-site && npm run dev
```

Navigate to `http://localhost:3000/simejni-spravy`. Expected: service page with breadcrumbs, title, sub-services grid, FAQ, and contact form.

- [ ] **Step 5: Verify all 8 service pages build**

```bash
cd D:/advokat-site && npm run build
```

Expected: all 8 service pages generated statically (listed in build output).

- [ ] **Step 6: Commit**

```bash
git add src/app/\[slug\]/ src/components/Breadcrumbs.tsx src/components/ServicePageContent.tsx
git commit -m "feat: add dynamic service pages with SSG, SEO, and FAQ schema"
```

---

## Task 11: Telegram API Route

**Files:**
- Create: `src/lib/telegram.ts`, `src/app/api/contact/route.ts`

- [ ] **Step 1: Create Telegram utility**

Create `src/lib/telegram.ts`:

```ts
interface ContactMessage {
  name: string;
  phone: string;
}

export async function sendToTelegram({ name, phone }: ContactMessage) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    throw new Error("Telegram credentials not configured");
  }

  const text = [
    "📩 *Нова заявка з сайту*",
    "",
    `👤 *Ім'я:* ${escapeMarkdown(name)}`,
    `📞 *Телефон:* ${escapeMarkdown(phone)}`,
    "",
    `🕐 *Час:* ${new Date().toLocaleString("uk-UA", { timeZone: "Europe/Kyiv" })}`,
  ].join("\n");

  const res = await fetch(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "MarkdownV2",
      }),
    }
  );

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Telegram API error: ${error}`);
  }

  return res.json();
}

function escapeMarkdown(text: string): string {
  return text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, "\\$&");
}
```

- [ ] **Step 2: Create API route**

Create `src/app/api/contact/route.ts`:

```ts
import { NextResponse } from "next/server";
import { sendToTelegram } from "@/lib/telegram";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { error: "Ім'я та телефон обов'язкові" },
        { status: 400 }
      );
    }

    if (name.length > 100 || phone.length > 20) {
      return NextResponse.json(
        { error: "Невірні дані" },
        { status: 400 }
      );
    }

    await sendToTelegram({ name, phone });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Помилка відправки" },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 3: Verify build succeeds**

```bash
cd D:/advokat-site && npm run build
```

Expected: build succeeds, `/api/contact` listed as a serverless function.

- [ ] **Step 4: Commit**

```bash
git add src/lib/telegram.ts src/app/api/contact/route.ts
git commit -m "feat: add Telegram notification API route for contact form"
```

---

## Task 12: Google Reviews Integration

**Files:**
- Create: `src/lib/google-places.ts`, `src/app/api/reviews/route.ts`, `src/components/Reviews.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Create Google Places utility**

Create `src/lib/google-places.ts`:

```ts
export interface GoogleReview {
  authorName: string;
  rating: number;
  text: string;
  relativeTimeDescription: string;
}

export interface PlaceDetails {
  rating: number;
  totalReviews: number;
  reviews: GoogleReview[];
}

export async function getPlaceReviews(): Promise<PlaceDetails | null> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (!apiKey || !placeId) {
    return null;
  }

  try {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=rating,user_ratings_total,reviews&language=uk&key=${apiKey}`,
      { next: { revalidate: 86400 } } // 24 hours
    );

    if (!res.ok) return null;

    const data = await res.json();
    const result = data.result;

    if (!result) return null;

    return {
      rating: result.rating ?? 0,
      totalReviews: result.user_ratings_total ?? 0,
      reviews: (result.reviews ?? []).map(
        (r: { author_name: string; rating: number; text: string; relative_time_description: string }) => ({
          authorName: r.author_name,
          rating: r.rating,
          text: r.text,
          relativeTimeDescription: r.relative_time_description,
        })
      ),
    };
  } catch {
    return null;
  }
}
```

- [ ] **Step 2: Create Reviews component**

Create `src/components/Reviews.tsx`:

```tsx
import { contacts } from "@/data/contacts";
import type { PlaceDetails } from "@/lib/google-places";

interface ReviewsProps {
  data: PlaceDetails | null;
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={star <= rating ? "text-amber-400" : "text-slate-600"}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default function Reviews({ data }: ReviewsProps) {
  if (!data || data.reviews.length === 0) {
    return (
      <section id="reviews" className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            <span className="gold-gradient">Відгуки</span> клієнтів
          </h2>
          <p className="text-slate-400 mb-6">
            Подивіться, що кажуть клієнти про мою роботу
          </p>
          <a
            href={contacts.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 glass glass-hover text-amber-400 font-medium rounded-xl"
          >
            Читати відгуки в Google →
          </a>
        </div>
      </section>
    );
  }

  return (
    <section id="reviews" className="py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            <span className="gold-gradient">Відгуки</span> клієнтів
          </h2>
          <div className="flex items-center justify-center gap-3">
            <Stars rating={Math.round(data.rating)} />
            <span className="text-white font-semibold">{data.rating}</span>
            <span className="text-slate-400">
              ({data.totalReviews} відгуків у Google)
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.reviews.slice(0, 6).map((review, index) => (
            <div key={index} className="glass p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-amber-400/20 flex items-center justify-center text-amber-400 font-bold">
                  {review.authorName.charAt(0)}
                </div>
                <div>
                  <p className="text-white font-medium text-sm">
                    {review.authorName}
                  </p>
                  <p className="text-slate-500 text-xs">
                    {review.relativeTimeDescription}
                  </p>
                </div>
              </div>
              <Stars rating={review.rating} />
              <p className="text-slate-300 text-sm leading-relaxed mt-3 line-clamp-4">
                {review.text}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <a
            href={contacts.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 glass glass-hover text-amber-400 font-medium rounded-xl"
          >
            Усі відгуки в Google →
          </a>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Update page.tsx to fetch and display reviews**

Replace `src/app/page.tsx`:

```tsx
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import ServicesGrid from "@/components/ServicesGrid";
import About from "@/components/About";
import Reviews from "@/components/Reviews";
import FAQ from "@/components/FAQ";
import Map from "@/components/Map";
import ContactForm from "@/components/ContactForm";
import { generalFAQ } from "@/data/faq";
import { generateFAQSchema } from "@/lib/schema";
import { getPlaceReviews } from "@/lib/google-places";

export const revalidate = 86400; // 24 hours

export default async function Home() {
  const reviews = await getPlaceReviews();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateFAQSchema(generalFAQ)),
        }}
      />
      <Hero />
      <Stats />
      <ServicesGrid />
      <About />
      <Reviews data={reviews} />
      <FAQ items={generalFAQ} />
      <Map />
      <section id="contacts" className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Зв&#39;яжіться <span className="gold-gradient">зі мною</span>
            </h2>
          </div>
          <ContactForm variant="section" />
        </div>
      </section>
    </>
  );
}
```

- [ ] **Step 4: Verify build**

```bash
cd D:/advokat-site && npm run build
```

Expected: build succeeds. Reviews section renders in fallback mode (no API key configured yet).

- [ ] **Step 5: Commit**

```bash
git add src/lib/google-places.ts src/components/Reviews.tsx src/app/page.tsx
git commit -m "feat: add Google Reviews integration with ISR (24h revalidate)"
```

---

## Task 13: Sitemap + Robots + SEO finalization

**Files:**
- Create: `src/app/sitemap.ts`, `src/app/robots.ts`

- [ ] **Step 1: Create sitemap.ts**

Create `src/app/sitemap.ts`:

```ts
import type { MetadataRoute } from "next";
import { services } from "@/data/services";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://advokat.jackmars.com.ua";

  const servicePages = services.map((service) => ({
    url: `${baseUrl}/${service.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...servicePages,
  ];
}
```

- [ ] **Step 2: Create robots.ts**

Create `src/app/robots.ts`:

```ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://advokat.jackmars.com.ua/sitemap.xml",
  };
}
```

- [ ] **Step 3: Verify sitemap and robots**

```bash
cd D:/advokat-site && npm run build && npm run start
```

Navigate to `http://localhost:3000/sitemap.xml` — expected: XML with all page URLs.
Navigate to `http://localhost:3000/robots.txt` — expected: allow all + sitemap URL.

- [ ] **Step 4: Commit**

```bash
git add src/app/sitemap.ts src/app/robots.ts
git commit -m "feat: add sitemap.xml and robots.txt auto-generation"
```

---

## Task 14: Vercel Deployment

- [ ] **Step 1: Verify full build passes**

```bash
cd D:/advokat-site && npm run build
```

Expected: no errors, all pages pre-rendered.

- [ ] **Step 2: Push latest to GitHub**

```bash
cd D:/advokat-site && git push origin main
```

- [ ] **Step 3: Connect to Vercel**

```bash
cd D:/advokat-site && npx vercel --yes
```

Follow prompts to link to Vercel account. Expected: project deployed to a preview URL.

- [ ] **Step 4: Set up production deployment**

```bash
npx vercel --prod
```

Expected: deployed to production URL.

- [ ] **Step 5: Configure custom domain**

In Vercel dashboard (or CLI):
1. Add domain `advokat.jackmars.com.ua`
2. At the DNS registrar for `jackmars.com.ua`, add a CNAME record:
   - Name: `advokat`
   - Value: `cname.vercel-dns.com`

- [ ] **Step 6: Set environment variables in Vercel**

```bash
vercel env add TELEGRAM_BOT_TOKEN production
vercel env add TELEGRAM_CHAT_ID production
vercel env add GOOGLE_PLACES_API_KEY production
vercel env add GOOGLE_PLACE_ID production
```

- [ ] **Step 7: Verify live site**

Navigate to `https://advokat.jackmars.com.ua` and verify:
- All pages load
- Mobile responsive
- Chat widget works
- Contact form submits (if Telegram configured)

- [ ] **Step 8: Commit any deployment config changes**

```bash
cd D:/advokat-site && git add -A && git commit -m "chore: Vercel deployment configuration"
```

---

## Self-Review Checklist

- ✅ **Spec coverage:** All sections covered — Hero, Stats, Services (primary + secondary), About, Reviews, FAQ, Map, Contacts, ChatWidget, Service pages, SEO, Telegram, Google Places, sitemap/robots, deployment
- ✅ **No placeholders:** All code is complete in every step
- ✅ **Type consistency:** `Service`, `FAQItem`, `PlaceDetails` types used consistently across all tasks
- ✅ **File paths match:** File structure in header matches all create/modify paths in tasks
- ✅ **Mobile-first:** All components use responsive Tailwind classes, touch-friendly targets
