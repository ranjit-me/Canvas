// Simple translation dictionary for common UI text
// This is a fallback when LibreTranslate API is unavailable

export const translations: Record<string, Record<string, string>> = {
    // English (source)
    "FREE": {
        es: "GRATIS",
        hi: "मुफ़्त",
        fr: "GRATUIT",
        ar: "مجاني",
        zh: "免费",
        pt: "GRÁTIS",
        bn: "বিনামূল্যে",
        ru: "БЕСПЛАТНО",
        ur: "مفت",
        id: "GRATIS",
        de: "KOSTENLOS"
    },
    "Preview": {
        es: "Vista previa",
        hi: "पूर्वावलोकन",
        fr: "Aperçu",
        ar: "معاينة",
        zh: "预览",
        pt: "Visualizar",
        bn: "প্রিভিউ",
        ru: "Предпросмотр",
        ur: "پیش نظارہ",
        id: "Pratinjau",
        de: "Vorschau"
    },
    "Buy Now": {
        es: "Comprar ahora",
        hi: "अभी खरीदें",
        fr: "Acheter maintenant",
        ar: "اشتري الآن",
        zh: "立即购买",
        pt: "Comprar agora",
        bn: "এখনই কিনুন",
        ru: "Купить сейчас",
        ur: "ابھی خریدیں",
        id: "Beli sekarang",
        de: "Jetzt kaufen"
    },
    "Use Free": {
        es: "Usar gratis",
        hi: "मुफ़्त उपयोग करें",
        fr: "Utiliser gratuitement",
        ar: "استخدم مجانا",
        zh: "免费使用",
        pt: "Usar grátis",
        bn: "বিনামূল্যে ব্যবহার করুন",
        ru: "Использовать бесплатно",
        ur: "مفت استعمال کریں",
        id: "Gunakan gratis",
        de: "Kostenlos nutzen"
    },
    "(33% off)": {
        es: "(33% de descuento)",
        hi: "(33% छूट)",
        fr: "(33% de réduction)",
        ar: "(خصم 33%)",
        zh: "(33%折扣)",
        pt: "(33% de desconto)",
        bn: "(33% ছাড়)",
        ru: "(скидка 33%)",
        ur: "(33% چھوٹ)",
        id: "(diskon 33%)",
        de: "(33% Rabatt)"
    },
    "Turn on the lights": {
        es: "Enciende las luces",
        hi: "लाइटें चालू करें",
        fr: "Allume les lumières",
        ar: "قم بتشغيل الأضواء",
        zh: "开灯",
        pt: "Acenda as luzes",
        bn: "আলো জ্বালান",
        ru: "Включить свет",
        ur: "لائٹیں چلائیں۔",
        id: "Nyalakan lampu",
        de: "Lichter einschalten"
    },
    "Next": {
        es: "Siguiente",
        hi: "अगला",
        fr: "Suivant",
        ar: "التالي",
        zh: "下一步",
        pt: "Próximo",
        bn: "পরবর্তী",
        ru: "Далее",
        ur: "اگلا",
        id: "Berikutnya",
        de: "Weiter"
    },
    "Yes": {
        es: "Sí",
        hi: "हाँ",
        fr: "Oui",
        ar: "نعم",
        zh: "是",
        pt: "Sim",
        bn: "হ্যাঁ",
        ru: "Да",
        ur: "جی ہاں",
        id: "Ya",
        de: "Ja"
    },
    "No": {
        es: "No",
        hi: "नहीं",
        fr: "Non",
        ar: "لا",
        zh: "不",
        pt: "Não",
        bn: "না",
        ru: "Нет",
        ur: "نہیں",
        id: "Tidak",
        de: "Nein"
    },
    "Tap for a Kiss 💋": {
        es: "Toca para un beso 💋",
        hi: "किस के लिए टैप करें 💋",
        fr: "Appuyez pour un baiser 💋",
        ar: "اضغط للحصول على قبلة 💋",
        zh: "点击吻一下 💋",
        pt: "Toque para um beijo 💋",
        bn: "চুম্বনের জন্য আলতো চাপুন 💋",
        ru: "Нажми для поцелуя 💋",
        ur: "بوسہ لینے کے لیے تھپتھپائیں۔ 💋",
        id: "Ketuk untuk ciuman 💋",
        de: "Für einen Kuss tippen 💋"
    }
};

export function getTranslation(text: string, targetLang: string): string | null {
    if (targetLang === "en") return text;

    const translation = translations[text];
    if (translation && translation[targetLang]) {
        return translation[targetLang];
    }

    return null;
}
