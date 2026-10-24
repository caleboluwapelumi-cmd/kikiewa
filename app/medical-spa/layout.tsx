/**
 * Every skin & aesthetics page sits in the clinical tone: cool surfaces and
 * hairlines (app/globals.css, tone-clinical). Same components, same brand.
 */
export default function MedicalSpaLayout({ children }: LayoutProps<"/medical-spa">) {
  return <div className="tone-clinical">{children}</div>;
}
