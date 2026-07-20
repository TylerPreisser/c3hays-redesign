/**
 * GiveSection — intentionally disabled.
 *
 * Product decision (per site owner): there is NO "Give" marketing section on the
 * website. People give through the C3 app, not the website. Giving now lives ONLY
 * as a small link in the footer. This component renders nothing so the homepage
 * never shows a Give block even if it is still referenced in the page tree.
 *
 * Accepts (and ignores) any props so existing/CMS-injected usages still compile.
 *
 * EDITABILITY SWEEP (redesign): intentionally NOT tagged with <Tx>. There is no
 * authored heading/paragraph/label to make editable — the component renders nothing
 * by product decision. Tagging would require resurrecting a Give block the owner
 * explicitly removed, so it is left as a null render on purpose.
 */
export default function GiveSection(_props?: unknown) {
  return null;
}
