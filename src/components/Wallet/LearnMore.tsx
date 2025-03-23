
import { Link } from "@heroui/link";

export default function LearnMore() {
  return (
    <div className="flex flex-col">
      <p className="text-sm p-2 text-center leading-[1.5]">If you want to explore further,<br/>visit <Link isExternal href="https://getmonero.org">getmonero.org</Link></p>
    </div>
  );
}