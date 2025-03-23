import { useTitle } from '@/context/TitleContext';
import { Button } from "@heroui/button";
import {
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
} from "@heroui/navbar";
import {Spinner} from "@heroui/spinner";
import { ThemeSwitch } from "@/components/theme-switch";
import { Logo } from "@/constants/icons";
import { useNavbarButton } from '@/context/NavbarButtonContext';
import { useLoading } from '@/context/LoadingContext';


export const Navbar = () => {
  const { title } = useTitle();
  const { icon, onClick } = useNavbarButton();
  const { loading } = useLoading();

  return (
    <HeroUINavbar maxWidth="lg" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand className="gap-3 max-w-fit">
          <div
            className="flex justify-start items-center gap-1"
            color="foreground"
          >
            <Logo />
            <div className="font-bold text-inherit flex flex-row items-center ">{title} {loading && <Spinner size="sm" className='pb-2 pl-2' color='default' variant='wave' />}</div>
          </div>
        </NavbarBrand>
      </NavbarContent>


      <NavbarContent className="flex  pl-4" justify="end">
        <ThemeSwitch />
        <Button
            className="text-sm font-normal text-default-600 bg-default-100"
            startContent={icon}
            variant="flat"
            isIconOnly
            onPress={onClick}
          >
          </Button>
      </NavbarContent>
    </HeroUINavbar>
  );
};
