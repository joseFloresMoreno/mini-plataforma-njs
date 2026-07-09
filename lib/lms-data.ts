import { createClient } from "@vercel/kv";

export type DemoRole = "student" | "admin";

export type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
};

export type CourseSection = {
  id: string;
  title: string;
  summary: string;
  html: string;
  videoUrl: string;
  durationMinutes: number;
  quiz?: QuizQuestion[];
};

export type CourseModule = {
  id: string;
  title: string;
  description: string;
  sections: CourseSection[];
};

export type Course = {
  id: string;
  slug: string;
  title: string;
  description: string;
  overview: string;
  level: string;
  duration: string;
  instructor: string;
  accent: string;
  modules: CourseModule[];
};

export type DemoUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: DemoRole;
  enrolledCourseIds: string[];
};

export type DashboardCourse = Course & {
  completedSections: number;
  totalSections: number;
  progressPercent: number;
  nextSectionTitle: string | null;
};

const videoPlaceholder = "";

export const demoUsers: DemoUser[] = [
  {
    id: "user-ana",
    name: "Ana Torres",
    email: "ana@demo.com",
    password: "lms123",
    role: "student",
    enrolledCourseIds: ["sopaipillas", "suculentas"],
  },
  {
    id: "user-carlos",
    name: "Carlos Mendoza",
    email: "carlos@demo.com",
    password: "lms123",
    role: "student",
    enrolledCourseIds: ["sopaipillas"],
  },
  {
    id: "user-admin",
    name: "Administrador",
    email: "admin@demo.com",
    password: "admin123",
    role: "admin",
    enrolledCourseIds: ["sopaipillas", "suculentas"],
  },
];

export const demoCourses: Course[] = [
  {
    id: "sopaipillas",
    slug: "instrucciones-sopaipillas",
    title: "Instrucciones para hacer Sopaipillas",
    description:
      "Aprende la receta tradicional chilena para preparar las sopaipillas perfectas paso a paso.",
    overview:
      "Este curso cubre todo el proceso: desde la selección de ingredientes, el zapallo ideal, el amasado correcto y los secretos para una fritura perfecta.",
    level: "Básico",
    duration: "1h 30m",
    instructor: "Chef Tradicional",
    accent: "from-amber-400 to-orange-600",
    modules: [
      {
        id: "sop-m1",
        title: "Preparación de la Masa",
        description: "Ingredientes y técnicas de amasado.",
        sections: [
          {
            id: "sop-m1-s1",
            title: "Ingredientes Básicos",
            summary: "Los componentes esenciales de la masa.",
            html: `
              <p>Las sopaipillas chilenas tradicionales se distinguen por el uso de zapallo cocido en la masa, el cual le aporta suavidad, color y un sabor único.</p>
              
              <p>Desliza lateralmente para conocer los ingredientes clave de esta receta:</p>
              
              <div class="lms-slider">
                <div class="lms-slider-track">
                  <div class="lms-slider-card">
                    <h4 style="font-weight: 700; color: var(--accent); margin-bottom: 0.5rem;">🌾 Harina</h4>
                    <p style="font-size: 0.875rem; line-height: 1.5;">2 tazas de harina sin polvos de hornear. Aporta la estructura base de la sopaipilla.</p>
                  </div>
                  <div class="lms-slider-card">
                    <h4 style="font-weight: 700; color: var(--accent); margin-bottom: 0.5rem;">🎃 Zapallo</h4>
                    <p style="font-size: 0.875rem; line-height: 1.5;">1 taza de zapallo molido cocido y tibio. Aporta el color dorado y la textura suave.</p>
                  </div>
                  <div class="lms-slider-card">
                    <h4 style="font-weight: 700; color: var(--accent); margin-bottom: 0.5rem;">🧈 Manteca</h4>
                    <p style="font-size: 0.875rem; line-height: 1.5;">3 cucharadas de manteca derretida tibia. Proporciona la elasticidad y grasas necesarias.</p>
                  </div>
                  <div class="lms-slider-card">
                    <h4 style="font-weight: 700; color: var(--accent); margin-bottom: 0.5rem;">🧂 Sal</h4>
                    <p style="font-size: 0.875rem; line-height: 1.5;">1 cucharadita de sal fina. Realza los sabores dulces naturales del zapallo camote.</p>
                  </div>
                </div>
              </div>

              <div class="lms-card-tip">
                <div>
                  <strong>Consejo de Cocina:</strong> Asegúrate de que el zapallo esté bien molido y tibio al momento de mezclar para lograr una integración homogénea perfecta.
                </div>
              </div>
            `,
            videoUrl: videoPlaceholder,
            durationMinutes: 10,
          },
          {
            id: "sop-m1-s2",
            title: "Amasado y Estirado",
            summary: "Cómo lograr la consistencia ideal y cortar las sopaipillas.",
            html: `
              <p>El amasado es el paso crítico para activar el gluten en la cantidad justa y lograr que la sopaipilla no quede dura ni chiclosa.</p>
              
              <ol class="lms-step-list">
                <li><strong>Mezclar:</strong> Junta la harina y la sal en un mesón. Haz un pozo en el centro y vierte el zapallo y la manteca tibia.</li>
                <li><strong>Integrar:</strong> Con las manos, incorpora la harina hacia el centro del pozo de forma progresiva.</li>
                <li><strong>Amasar:</strong> Trabaja la masa firmemente durante 5 a 10 minutos hasta que esté lisa y no se pegue en los dedos.</li>
                <li><strong>Estirar:</strong> Con un uslero, estira la masa hasta dejarla de un grosor aproximado de 5 milímetros y córtala en círculos.</li>
              </ol>
            `,
            videoUrl: videoPlaceholder,
            durationMinutes: 15,
          },
        ],
      },
      {
        id: "sop-m2",
        title: "Fritura y Evaluación",
        description: "El proceso final y evaluación del aprendizaje.",
        sections: [
          {
            id: "sop-m2-s1",
            title: "El Arte de Freír",
            summary: "Temperatura y tiempos para que queden crujientes y doradas.",
            html: `
              <p>La fritura es el paso final que define la textura. Una temperatura inadecuada puede hacer que las sopaipillas absorban demasiado aceite o se quemen por fuera quedando crudas por dentro.</p>
              
              <div class="lms-card-warning">
                <div>
                  <strong>¡Atención con la Fritura!</strong> El aceite debe estar a una temperatura constante de aproximadamente 175°C.
                </div>
              </div>

              <ol class="lms-step-list">
                <li><strong>Calentar:</strong> Utiliza abundante aceite de buena calidad en una olla profunda.</li>
                <li><strong>Perforar:</strong> Pincha cada sopaipilla con un tenedor antes de freír para evitar que se inflen demasiado en el aceite.</li>
                <li><strong>Freír:</strong> Cocina de 2 a 3 minutos por lado hasta obtener un color dorado parejo.</li>
                <li><strong>Escurrir:</strong> Retira con espumadera y colócalas sobre papel absorbente para eliminar el exceso de grasa.</li>
              </ol>
            `,
            videoUrl: videoPlaceholder,
            durationMinutes: 10,
          },
          {
            id: "sop-m2-s2",
            title: "Cuestionario de Certificación",
            summary: "Responde las preguntas finales para completar y cerrar el curso.",
            html: `
              <p>Responde correctamente todas las preguntas para desbloquear la finalización de este curso.</p>
              
              <div class="lms-card-info">
                <div>
                  <strong>Evaluación Final:</strong> Pon a prueba lo aprendido sobre ingredientes, amasado y tiempos de cocción de las sopaipillas chilenas.
                </div>
              </div>
            `,
            videoUrl: videoPlaceholder,
            durationMinutes: 15,
            quiz: [
              {
                id: "sop-q1",
                question: "¿Cuál es el ingrediente estrella que le da el color amarillo característico a la sopaipilla chilena?",
                options: ["Papas", "Zapallo camote", "Zanahoria", "Maíz"],
                correctOptionIndex: 1,
              },
              {
                id: "sop-q2",
                question: "¿A qué temperatura aproximada debe estar el aceite para freír las sopaipillas?",
                options: ["100°C", "175°C", "300°C", "50°C"],
                correctOptionIndex: 1,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "suculentas",
    slug: "cuidados-suculentas",
    title: "Cuidados generales para suculentas en casa",
    description:
      "Guía práctica para mantener tus suculentas sanas, fuertes y hermosas en interiores o terrazas.",
    overview:
      "Aprende sobre la iluminación necesaria, la técnica correcta de riego para evitar la pudrición, y cómo preparar el sustrato drenante ideal.",
    level: "Básico",
    duration: "2h 00m",
    instructor: "Especialista en Botánica",
    accent: "from-emerald-400 to-teal-600",
    modules: [
      {
        id: "suc-m1",
        title: "Luz y Riego",
        description: "Los dos pilares fundamentales del cuidado.",
        sections: [
          {
            id: "suc-m1-s1",
            title: "Requisitos de Iluminación",
            summary: "Cuánta luz necesitan y cómo detectar la falta de sol.",
            html: `
              <p>Las suculentas aman la luz solar. Requieren de 4 a 6 horas de sol diario filtrado o directo suave para evitar la etiolación (cuando se estiran buscando luz).</p>
              
              <div class="lms-card-info">
                <div>
                  <strong>Regla de Oro de Luz:</strong> Si la planta comienza a estirarse, perder su color vivo o a separarse demasiado entre hojas, es síntoma inequívoco de que le falta luz.
                </div>
              </div>

              <div class="lms-card-tip">
                <div>
                  <strong>Tip de Ubicación:</strong> Colócalas cerca de ventanas orientadas al norte o este para recibir la mejor iluminación del día.
                </div>
              </div>
            `,
            videoUrl: videoPlaceholder,
            durationMinutes: 10,
          },
          {
            id: "suc-m1-s2",
            title: "Método de Riego",
            summary: "El secreto del riego: remojo y secado.",
            html: `
              <p>El error número uno en el cultivo de suculentas es el riego excesivo, el cual pudre las raíces de forma irreversible.</p>
              
              <div class="lms-card-warning">
                <div>
                  <strong>¡Importante!</strong> Riega solo cuando el sustrato esté 100% seco. Es mejor pecar de regar poco que de regar en exceso.
                </div>
              </div>

              <ol class="lms-step-list">
                <li><strong>Observar:</strong> Revisa el estado de la tierra introduciendo un palito de madera hasta el fondo.</li>
                <li><strong>Regar:</strong> Moja abundantemente toda la tierra de la maceta hasta que veas salir agua por abajo.</li>
                <li><strong>Drenar:</strong> Deja que todo el excedente escurra. NUNCA dejes agua empozada en el platillo de la maceta.</li>
                <li><strong>Esperar:</strong> No vuelvas a regar hasta que la tierra esté completamente seca otra vez (aproximadamente cada 10 o 15 días, dependiendo del clima).</li>
              </ol>
            `,
            videoUrl: videoPlaceholder,
            durationMinutes: 10,
          },
        ],
      },
      {
        id: "suc-m2",
        title: "Sustrato y Evaluación",
        description: "Preparación de la maceta y prueba final.",
        sections: [
          {
            id: "suc-m2-s1",
            title: "Tierra y Drenaje",
            summary: "Preparando el hogar perfecto para tu suculenta.",
            html: `
              <p>Para evitar la humedad excesiva, las suculentas necesitan un suelo poroso y suelto que permita el rápido paso del agua.</p>
              
              <div class="lms-card-info">
                <div>
                  <strong>Sustrato Recomendado:</strong>
                  <ul style="list-style-type: disc; padding-left: 1.25rem; margin-top: 0.5rem;">
                    <li>3 tazas de tierra de hojas.</li>
                    <li>2 tazas de arena gruesa o de lámpara.</li>
                    <li>2 tazas de piedra de perlita o piedra pómez fina.</li>
                  </ul>
                </div>
              </div>

              <div class="lms-card-warning">
                <div>
                  <strong>Regla Obligatoria:</strong> La maceta SIEMPRE debe tener un orificio de drenaje en su base para evitar que las raíces permanezcan empapadas.
                </div>
              </div>
            `,
            videoUrl: videoPlaceholder,
            durationMinutes: 15,
          },
          {
            id: "suc-m2-s2",
            title: "Evaluación del Jardinero",
            summary: "Demuestra tus conocimientos para finalizar el curso.",
            html: `
              <p>Responde correctamente todas las preguntas para desbloquear la finalización de este curso.</p>
              
              <div class="lms-card-tip">
                <div>
                  <strong>Evaluación Final:</strong> Demuestra que comprendes el riego, la luz y la tierra recomendada para estas increíbles plantas.
                </div>
              </div>
            `,
            videoUrl: videoPlaceholder,
            durationMinutes: 15,
            quiz: [
              {
                id: "suc-q1",
                question: "¿Con qué frecuencia se deben regar las suculentas por lo general?",
                options: [
                  "Todos los días",
                  "Solo cuando el sustrato esté completamente seco",
                  "Una vez al año",
                  "Cada dos horas",
                ],
                correctOptionIndex: 1,
              },
              {
                id: "suc-q2",
                question: "¿Qué es fundamental que tenga la maceta de una suculenta?",
                options: [
                  "Pintura brillante",
                  "Orificio de drenaje",
                  "Color rojo",
                  "Tapa hermética",
                ],
                correctOptionIndex: 1,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "comida-coreana",
    slug: "cocina-coreana-tradicional",
    title: "Cocina Coreana Tradicional y Moderna",
    description:
      "Descubre los secretos del Kimchi, el Bibimbap, el Bulgogi y las bases de la sazón en la península coreana.",
    overview:
      "Aprende desde las técnicas de fermentación ancestral hasta los platos urbanos más icónicos de Seúl con interactivos únicos.",
    level: "Intermedio",
    duration: "4h 30m",
    instructor: "Chef Sang-hoon Kim",
    accent: "from-red-500 to-blue-600",
    modules: [
      {
        id: "kor-m1",
        title: "Bases y Fermentación",
        description: "El arte del Kimchi y los condimentos fermentados.",
        sections: [
          {
            id: "kor-m1-s1",
            title: "Introducción al Kimchi",
            summary: "Fermentación paso a paso y la receta tradicional.",
            html: `
              <p>El Kimchi es el plato nacional de Corea, un acompañamiento fermentado a base de col china, ajo, jengibre y chile coreano (gochugaru).</p>
              
              <div class="lms-card-info">
                <div>
                  <strong>Beneficios:</strong> Es un superalimento rico en probióticos, vitaminas A, B y C, y fortalece el sistema inmunológico.
                </div>
              </div>

              <!-- CSS Modal Trigger -->
              <input type="checkbox" id="k-modal-check" style="display: none;" class="k-modal-state" />

              <label for="k-modal-check" style="display: inline-block; background-color: #2563eb; color: white; padding: 0.75rem 1.5rem; border-radius: 9999px; font-weight: 600; cursor: pointer; margin-top: 1rem; text-align: center; transition: all 0.2s;">
                📖 Ver Receta Secreta del Kimchi
              </label>

              <!-- CSS Modal Overlay -->
              <div class="k-modal-overlay">
                <div class="k-modal-box">
                  <div class="k-modal-header">
                    <h3>Receta de Kimchi Tradicional</h3>
                    <label for="k-modal-check" style="cursor: pointer; font-size: 1.25rem; color: #64748b;">✕</label>
                  </div>
                  <div class="k-modal-body" style="font-size: 0.875rem; line-height: 1.6; max-height: 350px; overflow-y: auto; text-align: left;">
                    <p><strong>Paso 1: Salado.</strong> Corta 1 col china a lo largo. Espolvorea abundante sal marina entre cada hoja. Deja reposar por 2 horas hasta que esté flexible. Enjuaga 3 veces.</p>
                    <p style="margin-top: 0.75rem;"><strong>Paso 2: La Papilla.</strong> Cocina 2 cucharadas de harina de arroz glutinoso en 1 taza de agua con 1 cucharada de azúcar hasta espesar. Deja enfriar.</p>
                    <p style="margin-top: 0.75rem;"><strong>Paso 3: Pasta Picante.</strong> Mezcla la papilla fría con 1/2 taza de gochugaru (chile coreano), 6 dientes de ajo molidos, 1 cucharadita de jengibre y 3 cucharadas de salsa de pescado.</p>
                    <p style="margin-top: 0.75rem;"><strong>Paso 4: Mezcla.</strong> Agrega cebollín y rábano cortados en juliana a la pasta. Úntala generosamente hoja por hoja en la col. Guarda en frasco hermético y fermenta a temperatura ambiente por 24-48 horas.</p>
                  </div>
                </div>
              </div>

              <style>
                .k-modal-overlay {
                  position: fixed;
                  top: 0;
                  left: 0;
                  width: 100vw;
                  height: 100vh;
                  background-color: rgba(15, 23, 42, 0.6);
                  backdrop-filter: blur(4px);
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  z-index: 99999;
                  opacity: 0;
                  pointer-events: none;
                  transition: opacity 0.3s ease;
                }
                .k-modal-state:checked ~ .k-modal-overlay {
                  opacity: 1;
                  pointer-events: auto;
                }
                .k-modal-box {
                  background: white;
                  border-radius: 1.5rem;
                  padding: 2rem;
                  width: 90%;
                  max-width: 500px;
                  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                  transform: scale(0.9);
                  transition: transform 0.3s ease;
                  color: #1e293b;
                }
                .k-modal-state:checked ~ .k-modal-overlay .k-modal-box {
                  transform: scale(1);
                }
                .k-modal-header {
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  border-bottom: 1px solid #e2e8f0;
                  padding-bottom: 0.75rem;
                  margin-bottom: 1rem;
                }
                .k-modal-header h3 {
                  font-weight: 700;
                  font-size: 1.25rem;
                  color: #0f172a;
                  margin: 0;
                }
              </style>
            `,
            videoUrl: "https://youtu.be/m79GEVJbWHc",
            durationMinutes: 20,
          },
          {
            id: "kor-m1-s2",
            title: "Las Salsas Madre (Jang)",
            summary: "Conoce el Gochujang, Doenjang y Ganjang.",
            html: `
              <p>La cocina coreana se fundamenta en tres condimentos principales obtenidos mediante fermentación lenta. Pasa el cursor o presiona las tarjetas para voltearlas:</p>
              
              <div class="k-cards-grid">
                <!-- Card 1 -->
                <div class="k-flip-container">
                  <div class="k-flip-card">
                    <div class="k-flip-front">
                      <span style="font-size: 2rem; margin-bottom: 0.5rem;">🌶️</span>
                      <h4>Gochujang</h4>
                      <p style="font-size: 0.75rem; opacity: 0.8; margin-top: 0.25rem;">Voltear tarjeta</p>
                    </div>
                    <div class="k-flip-back">
                      <h4>Pasta de Chile</h4>
                      <p style="font-size: 0.8rem; line-height: 1.4; margin-top: 0.5rem;">Pasta picante y dulce hecha de soja fermentada, arroz glutinoso y gochugaru.</p>
                    </div>
                  </div>
                </div>

                <!-- Card 2 -->
                <div class="k-flip-container">
                  <div class="k-flip-card">
                    <div class="k-flip-front">
                      <span style="font-size: 2rem; margin-bottom: 0.5rem;">🥣</span>
                      <h4>Doenjang</h4>
                      <p style="font-size: 0.75rem; opacity: 0.8; margin-top: 0.25rem;">Voltear tarjeta</p>
                    </div>
                    <div class="k-flip-back">
                      <h4>Pasta de Soja</h4>
                      <p style="font-size: 0.8rem; line-height: 1.4; margin-top: 0.5rem;">Pasta salada y umami similar al miso japonés pero con un perfil más terroso y profundo.</p>
                    </div>
                  </div>
                </div>
              </div>

              <style>
                .k-cards-grid {
                  display: grid;
                  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
                  gap: 1.5rem;
                  margin-top: 1.5rem;
                }
                .k-flip-container {
                  perspective: 1000px;
                  height: 160px;
                }
                .k-flip-card {
                  width: 100%;
                  height: 100%;
                  position: relative;
                  transform-style: preserve-3d;
                  transition: transform 0.6s ease;
                  cursor: pointer;
                }
                .k-flip-container:hover .k-flip-card {
                  transform: rotateY(180deg);
                }
                .k-flip-front, .k-flip-back {
                  width: 100%;
                  height: 100%;
                  position: absolute;
                  backface-visibility: hidden;
                  border-radius: 1rem;
                  padding: 1rem;
                  display: flex;
                  flex-direction: column;
                  justify-content: center;
                  align-items: center;
                  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
                  text-align: center;
                }
                .k-flip-front {
                  background: linear-gradient(135deg, #ef4444, #b91c1c);
                  color: white;
                }
                .k-flip-back {
                  background: white;
                  color: #1e293b;
                  border: 1px solid #e2e8f0;
                  transform: rotateY(180deg);
                }
                .k-flip-back h4 {
                  color: #b91c1c;
                  font-weight: 700;
                  margin: 0;
                }
              </style>
            `,
            videoUrl: videoPlaceholder,
            durationMinutes: 15,
          },
        ],
      },
      {
        id: "kor-m2",
        title: "Platos Fuertes Icónicos",
        description: "Preparación del Bibimbap y marinado de Bulgogi.",
        sections: [
          {
            id: "kor-m2-s1",
            title: "El Bibimbap Clásico",
            summary: "Aprende a balancear ingredientes en un bol de piedra caliente (Dolsot).",
            html: `
              <p>Bibimbap se traduce literalmente como "arroz mezclado". Su belleza reside en la armonía de colores (Osaek) que representa los cinco elementos.</p>
              
              <div class="lms-card-tip">
                <div>
                  <strong>Los 5 Elementos del Bibimbap:</strong>
                  <ul style="list-style-type: disc; padding-left: 1.25rem; margin-top: 0.5rem; font-size: 0.875rem;">
                    <li><strong>Madera (Verde):</strong> Espinacas escaldadas.</li>
                    <li><strong>Fuego (Rojo):</strong> Salsa Gochujang y zanahorias.</li>
                    <li><strong>Tierra (Amarillo):</strong> Yema de huevo.</li>
                    <li><strong>Metal (Blanco):</strong> Arroz y brotes de soja.</li>
                    <li><strong>Agua (Negro/Oscuro):</strong> Hongos Shiitake y carne.</li>
                  </ul>
                </div>
              </div>
            `,
            videoUrl: videoPlaceholder,
            durationMinutes: 20,
          },
          {
            id: "kor-m2-s2",
            title: "Bulgogi (Carne Marinado)",
            summary: "El clásico asado coreano de carne tierna marinada en soja y pera asiática.",
            html: `
              <p>El Bulgogi es tiras delgadas de lomo vetado marinadas. El ingrediente secreto tradicional es la pera rallada, que contiene enzimas naturales que ablandan la carne y añaden un dulzor suave.</p>
              
              <div class="lms-card-warning">
                <div>
                  <strong>¡Secreto del Chef!</strong> Deja marinar la carne por lo menos durante 2 horas (idealmente toda la noche) en el refrigerador para que las enzimas de la pera actúen.
                </div>
              </div>
            `,
            videoUrl: videoPlaceholder,
            durationMinutes: 15,
          },
        ],
      },
      {
        id: "kor-m3",
        title: "Sopas y Evaluación",
        description: "Estofado Jjigae y cuestionario final.",
        sections: [
          {
            id: "kor-m3-s1",
            title: "Kimchi Jjigae",
            summary: "El estofado más reconfortante de Corea.",
            html: `
              <p>El Kimchi Jjigae es una sopa caliente y picante. Se prepara cocinando a fuego lento kimchi maduro con tofu, cebollín y panceta de cerdo.</p>
              
              <div class="lms-card-info">
                <div>
                  <strong>Tip de Sabor:</strong> Entre más maduro y fermentado esté el kimchi, más profunda y ácida será la sopa. El kimchi fresco no dará el mismo sabor.
                </div>
              </div>
            `,
            videoUrl: videoPlaceholder,
            durationMinutes: 15,
          },
          {
            id: "kor-m3-s2",
            title: "Examen de Maestría",
            summary: "Demuestra tus conocimientos en gastronomía coreana.",
            html: `
              <p>Completa con éxito el cuestionario para finalizar el curso y recibir tu aprobación.</p>
            `,
            videoUrl: videoPlaceholder,
            durationMinutes: 15,
            quiz: [
              {
                id: "kor-q1",
                question: "¿Cuál es el chile coreano en polvo o escamas utilizado para hacer Kimchi?",
                options: ["Gochugaru", "Sriracha", "Cayena", "Jalapeño"],
                correctOptionIndex: 0,
              },
              {
                id: "kor-q2",
                question: "¿Qué ingrediente natural se usa tradicionalmente en el Bulgogi para ablandar la carne?",
                options: ["Limón", "Vinagre", "Pera asiática", "Piña"],
                correctOptionIndex: 2,
              },
              {
                id: "kor-q3",
                question: "¿Qué significa literalmente la palabra 'Bibimbap'?",
                options: ["Sopa picante", "Arroz mezclado", "Fideos fritos", "Carne asada"],
                correctOptionIndex: 1,
              },
            ],
          },
        ],
      },
    ],
  },
];

const isKvConfigured = !!(
  process.env.KV_URL ||
  process.env.KV_REST_API_URL ||
  process.env.KV_REST_API_TOKEN ||
  process.env.UPSTASH_REDIS_REST_URL ||
  process.env.UPSTASH_REDIS_REST_TOKEN
);

const kvClient = isKvConfigured
  ? createClient({
      url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || process.env.KV_URL || "",
      token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || "",
    })
  : null;

// Fallback in-memory progress for local development or when KV is not set up
const localProgress: Record<string, Record<string, string[]>> = {
  "user-ana": {
    "sopaipillas": ["sop-m1-s1", "sop-m1-s2"],
    "suculentas": ["suc-m1-s1"],
  },
  "user-carlos": {
    "sopaipillas": ["sop-m1-s1"],
  },
};

export async function getDemoUserByEmail(email: string): Promise<DemoUser | null> {
  if (isKvConfigured && kvClient) {
    try {
      const user = await kvClient.get<DemoUser>(`lms:user:email:${email.toLowerCase()}`);
      if (user) {
        // Auto-index user in global list if missing (for legacy registrations)
        const list = await kvClient.get<DemoUser[]>("lms:users:list") || [];
        if (!list.some((u) => u.id === user.id)) {
          list.push(user);
          await kvClient.set("lms:users:list", list);
        }
        return user;
      }
    } catch (e) {
      console.error("Error reading user by email from Vercel KV:", e);
    }
  }
  return demoUsers.find(
    (user) => user.email.toLowerCase() === email.toLowerCase(),
  ) ?? null;
}

export async function getDemoUserById(userId: string): Promise<DemoUser | null> {
  if (isKvConfigured && kvClient) {
    try {
      const user = await kvClient.get<DemoUser>(`lms:user:id:${userId}`);
      if (user) {
        // Auto-index user in global list if missing
        const list = await kvClient.get<DemoUser[]>("lms:users:list") || [];
        if (!list.some((u) => u.id === user.id)) {
          list.push(user);
          await kvClient.set("lms:users:list", list);
        }
        return user;
      }
    } catch (e) {
      console.error("Error reading user by id from Vercel KV:", e);
    }
  }
  return demoUsers.find((user) => user.id === userId) ?? null;
}

export async function saveDbUser(user: DemoUser): Promise<void> {
  if (isKvConfigured && kvClient) {
    try {
      await kvClient.set(`lms:user:id:${user.id}`, user);
      await kvClient.set(`lms:user:email:${user.email.toLowerCase()}`, user);
      
      const list = await kvClient.get<DemoUser[]>("lms:users:list") || [];
      const index = list.findIndex((u) => u.id === user.id);
      if (index !== -1) {
        list[index] = user;
      } else {
        list.push(user);
      }
      await kvClient.set("lms:users:list", list);
    } catch (e) {
      console.error("Error saving user to Vercel KV:", e);
    }
  }
}

export async function getAllUsers(): Promise<DemoUser[]> {
  let dynamicUsers: DemoUser[] = [];
  if (isKvConfigured && kvClient) {
    try {
      const list = await kvClient.get<DemoUser[]>("lms:users:list");
      if (list && Array.isArray(list)) {
        dynamicUsers = list;
      }
    } catch (e) {
      console.error("Error reading users list from KV:", e);
    }
  }
  
  const all = [...demoUsers];
  for (const user of dynamicUsers) {
    if (!all.some((u) => u.id === user.id || u.email.toLowerCase() === user.email.toLowerCase())) {
      all.push(user);
    }
  }
  return all;
}

export function getCourseById(courseId: string) {
  return demoCourses.find((course) => course.id === courseId);
}

export function flattenCourseSections(course: Course) {
  return course.modules.flatMap((module) => module.sections);
}

export async function getUserCompletedSectionIds(userId: string, courseId: string): Promise<string[]> {
  if (isKvConfigured && kvClient) {
    try {
      const progress = await kvClient.get<string[]>(`lms:progress:${userId}:${courseId}`);
      return progress ?? [];
    } catch (e) {
      console.error("Error reading from Vercel KV:", e);
    }
  }
  return localProgress[userId]?.[courseId] ?? [];
}

export async function saveSectionProgress(userId: string, courseId: string, sectionId: string): Promise<string[]> {
  const current = await getUserCompletedSectionIds(userId, courseId);
  const updated = current.includes(sectionId) ? current : [...current, sectionId];
  
  if (isKvConfigured && kvClient) {
    try {
      await kvClient.set(`lms:progress:${userId}:${courseId}`, updated);
    } catch (e) {
      console.error("Error writing to Vercel KV:", e);
    }
  } else {
    if (!localProgress[userId]) {
      localProgress[userId] = {};
    }
    localProgress[userId][courseId] = updated;
  }
  return updated;
}

export async function getDashboardCourses(userId: string): Promise<DashboardCourse[]> {
  const user = await getDemoUserById(userId);

  if (!user) {
    return [];
  }

  const coursesToMap = user.role === "admin"
    ? demoCourses
    : user.enrolledCourseIds
        .map((id) => demoCourses.find((c) => c.id === id))
        .filter((c): c is typeof demoCourses[0] => !!c);

  const coursePromises = coursesToMap.map(async (course) => {

    if (!course) {
      return null;
    }

    const sections = flattenCourseSections(course);
    const completedSections = await getUserCompletedSectionIds(userId, course.id);
    const completedCount = completedSections.length;
    const totalSections = sections.length;
    const progressPercent =
      totalSections === 0
        ? 0
        : Math.round((completedCount / totalSections) * 100);
    const nextSectionTitle =
      sections.find((section) => !completedSections.includes(section.id))
        ?.title ?? null;

    return {
      ...course,
      completedSections: completedCount,
      totalSections,
      progressPercent,
      nextSectionTitle,
    };
  });

  const resolved = await Promise.all(coursePromises);
  return resolved.filter((course): course is DashboardCourse => course !== null);
}

export async function getCourseProgressSummary(userId: string, courseId: string) {
  const course = getCourseById(courseId);

  if (!course) {
    return null;
  }

  const completedSectionIds = await getUserCompletedSectionIds(userId, courseId);
  const sections = flattenCourseSections(course);
  const progressPercent =
    sections.length === 0
      ? 0
      : Math.round((completedSectionIds.length / sections.length) * 100);

  return {
    course,
    sections,
    completedSectionIds,
    progressPercent,
  };
}

export async function resetUserProgress(userId: string, courseId: string): Promise<void> {
  if (isKvConfigured && kvClient) {
    try {
      await kvClient.del(`lms:progress:${userId}:${courseId}`);
    } catch (e) {
      console.error("Error deleting progress key from Vercel KV:", e);
      throw e;
    }
  } else {
    if (localProgress[userId]) {
      delete localProgress[userId][courseId];
    }
  }
}
