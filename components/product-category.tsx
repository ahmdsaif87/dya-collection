import Link from "next/link";

export default function ProductCategory() {
  const category = [
    "Tas Punggung",
    "Tas Wanita",
    "Daster",
    "Dompet",
    "Jam Tangan",
    "Pouch"
  ];

  return (
    <div className="flex items-center justify-center py-10">
      <div className="text-center">
        <ul className="flex flex-wrap justify-center gap-2">
          {category.map((item, index) => (
            <li key={index}>
              <Link
                href={`/kategori/${encodeURIComponent(item.toLowerCase().replace(/\s+/g, "-"))}`}
                className="px-4 py-2 rounded-full bg-black-200 border text-white-800 hover:bg-white-300 transition-colors text-sm"
              >
                {item}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
