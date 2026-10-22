import { CustomSiteModule, SitePage } from '../types';

interface CustomSiteModulesProps {
  page: SitePage;
  modules: CustomSiteModule[];
}

export default function CustomSiteModules({ page, modules }: CustomSiteModulesProps) {
  return (
    <>
      {modules.map((module) => (
        <section
          key={module.id}
          data-site-module={module.id}
          data-site-page={page}
          data-site-custom-module
          className="mx-4 my-8 border-[3px] border-black bg-white p-6 md:mx-8 md:p-10"
        >
          <div className="mx-auto max-w-5xl">
            {module.imageUrl && (
              <img
                src={module.imageUrl}
                alt={module.title}
                className="mb-6 max-h-[520px] w-full border-2 border-black object-cover"
              />
            )}
            <p className="mb-2 font-mono text-[10px] font-black uppercase tracking-widest text-[#2563eb]">
              MÓDULO EDITABLE
            </p>
            <h2 className="font-serif text-2xl font-black text-black md:text-4xl">{module.title}</h2>
            <p className="mt-4 whitespace-pre-line font-sans text-sm leading-relaxed text-gray-700">{module.body}</p>
          </div>
        </section>
      ))}
    </>
  );
}
