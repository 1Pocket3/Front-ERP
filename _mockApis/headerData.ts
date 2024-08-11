import type { profileType, languageType } from "@/types/HeaderTypes";

import proUser1 from "@/assets/images/svgs/icon-account.svg";
const profileDD: profileType[] = [
  {
    avatar: proUser1,
    title: "my_profile",
    subtitle: "Account settings",
    href: "/profile",
  },
];

//
// Language
//
import ro from "@/assets/images/flag/ro.svg";
import ru from "@/assets/images/flag/ru.svg";

const languageDD: languageType[] = [
  { title: "Română", subtext: "RO", value: "ro", avatar: ro },
  { title: "Русский", subtext: "RU", value: "ru", avatar: ru },
];

export { profileDD, languageDD };
