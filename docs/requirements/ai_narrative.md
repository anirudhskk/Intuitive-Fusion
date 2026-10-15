# AI narrative (client-supplied, verbatim from the register's AI tab)

Not yet decomposed into numbered requirements — see docs/open-decisions.md.

AI will have overarching framework. The tool’s framework sits on top, then the policies of the group that the enterprise belongs to (eg for federal government it’s the commonwealth procurement rules (CPR) and for private it could be Priceline pharmacy chain), then the policy of the individual enterprise along with their own training data eg past contracts and past tender documents (eg tourism australia is part of commonwealth government and Priceline store belongs to Priceline chain). The AI will create output based on the 3 tiers in terms of prioritisation of decision making and output. For instance when a user asks to buy an function centre in China for an event that costs $1 mil, our platform will be referenced first to see if there is a good description of the requirements equivalent to training data. It then checks whether the output aligns to the CPR which says overseas procurements for consumption overseas are exempted from the CPR. This means the AI knows an open tender process where any company around the world can bid and it’s done on a separate government platform, will NOT be needed. The enterprises own policy states that anything over $500k needs executive general manager approval.

Knowing all that, and knowing $1mil is considered high value so more details is required, the AI will prepopulate all the required fields that’s been preset and the first set of fields relate to everything needed in a request form followed by the procurement plan then tender pack:

- dates

- estimated cost

- business units,

- contract owner

- state the exemption in the CPR

- background on why the procurement is needed

- detailed requirements

- deliverables

- milestones

- types of risks, their associated risk levels, risk mitigation strategies

- who the evaluation committee will be and their previously disclosed COI if applicable. These people will then need to review and digitally sign off the plan via clicking a button

- any steering committee members and their role titles

- other governance structures and members and their role titles

- who the delegate is to approve the procurement plan and their role

- if any IT, legal or another applicable department needs to be consulted or endorse the activity

- what the due diligence process will be to assess the viability of the supplier eg financial viability assessment or reference checks or visiting the venue etc

A lot of the information in the fields can be duplicated with users select the procurement plan view or the tender document view. The users will be able have a printable version of all documents is Word and pdf format. It needs to show time stamps in the document on when people has approved.

Users will then be able to tell the AI using voice or text that they want to change any field and the field re-populates. Users can also say only change paragraph 3 with xx and keep everything else the same. This then gets pushed to other fields that are the same eg the user wants to add a milestone 7 in the procurement plan to be final invoice, this is then updated in the tender pack. Depending on the outcome of the tender, the milestones may be the same for the contract and for the contract management plan. Or it may be updated.

Request plus the same functionality across the entire platform

users user word or text to tell teh platform what it wants to procure. the AI populates all the required fields and if there's any missing fields, it will prompt the user with questions (voice chat and text ).

across the entire platform and all modules, users can review the fields that has been populated and tell AI what to change. users can change any field or any part of the field by telling AI eg in the field for change paragraph 5 to X and keep everything else the same

the platform gives 2 methods of engaging with users. 1. self service eg for low value procurements and the end to end process is fully automated and helped by AI voice and text chats. 2. procurement team lead and procurement team can raise a request on behalf of the user or the users can raise it and the procurement team is notified eg for high value or high risk procurements. the AI will have predetermined workflows that triggers when to alert the procurement team.

AI will alert all required people based on the needs of each enterprise eg IT will be auto alerted if it relates to IT

AI will be able to review the enterprises' own dataset eg contracts, tender documents etc and combine it with industry best practice eg every week, the platform searches available new data and recreates best goods and services descriptions for hudreds of roles descriptions, service requirements, deliverables etc which then gets sent to the backend of every enterprieses' platform so it doesn't need to risk the security of data for the enterprises. this will then be used to populate each field

the platform will be able to code into the back end to ensure consistency of output eg if a user wants a java developer, it will get the same output each time by following the same steps to search and create output

everything in the platform can be pulled by the AI into reports

Procurement Plan

users, key stakeholders, the procurement team and anyone else that has been added to the procurement (eg advisors, 2nd approver, probity advisory, external probity advisory, external procurement team etc) will see a completed procurement plan

they can all collaborate and make changes in the platform in any field or any field they have been granted access to

once the procurement plan stage is approved, it is locked and it cannot be reopened by the user. the procurement team will have permission to reopen a procurement plan stage if something such as the evaluation criteria needs to be changed

If dates and timings change, it will be auto updated across all documents

AI will review all internal and external policies relating to the entity and determine if any additional requirements are needed to be included eg modern slavery, sustainability, economic benefit, exemptions etc

conflict of interest will be asked, declared, and if required, approved by the delegate or risk and compliance team. sometimes evaluation committees will be removed due to a material conflict

Approvals

it will remind users and stakeholders to sign the procurement plan. it will do the same for delegates to approve (if required). Procurement team has the ability to override each step if required. procurement plans must be printable and have digital stamp of when it was signed.

delegates and approve via voice or clicking a button. they can also approve on their phones.

users such as the delegate can receive emails on the phones and teams (both with links directly to the procurement and to the respective pages of the procurement eg if delegate is required to approve the procurement plan, the link will take them to the section of the procurement plan. they will be able to see the entire summary or detail of the procurement on 1 screen.

Tendering (RFT, RFP, RFQ, RFI, EOI)

tender pack is prepopulated based on the request and procurement plan. users can jump ahead to prepare the tender pack while waiting for the procurement plan to close. in some enterprieses, procurement plans may not be needed or not needed until it reaches a certain value.

the AI will know based on the workflow, which templates to use eg for commonwealth government, there's the commonwealth contracting suite, the different tendering and Work Orders templates from different panels, each agency's own tendering and contract templates etc. using Json or equivalent, the documents will be populated automatically. The AI will know if the contents of the procurement plan is adequate or if a major tender is being conducted, the AI will insert a lot more information such as detailed requirements, deliverables, milestones, KPIs etc into the tender pack.

If dates and timings change, it will be auto updated across all documents

If possible, the AI can help suppliers review their submisison to see if it has addressed all the requirements and recommend areas for improvement based on what it has submitted but keeping it factual.

Q&A will be auto created based off a conversation with the person responsible for input. others can review. when it's ready, it will be auto published and sent to all or selected supplier(s).

Evaluation

evaluation scoring sheet (excel or ideally in the platform) will be prepopulated based on the suppliers who have responded eg if 5 suppleirs responded then each of the 5 will be listed in the column fields and each criteria with weightings will be listed on the rows fields. users can then user voice or text to score each supplier and to add comments or reasons for the scores. it will be individual scoring in most instances but not always. if a consensus meeting or multiple meetings are needed then the scores can be auto updated based on conversation eg capability for microsoft will be revised down from a score of 5 to a score of 4.

AI can either remove pricing from the first part of the evaluation or it's not. depends on the user and enterprise preferences. AI can also help to rank because some basic low value procurements do not need individual scoring.

AI will be able to capture all commitments during workshops and demonstrations by the supplier and include it in the evaluation report and draft contract

AI will help users negotiate by developing a recommended negotiation plan with the strategies, walk away positions, likely outcomes etc

AI can also scan all submisisons and highlight any that are non compliant based on requirements

Evaluation Report

If dates and timings change, it will be auto updated across all documents

evaluation report will be based off the procurement plan, tender responses, individual comments, consensus meeting comments and it will be describing how the process in the proucrement plan was followed and what the outcome was which led to the jusfication of value for money and the decision that was made.

conflict of interest will be asked, re-declared, and if required, approved by the delegate or risk and compliance team. sometimes evaluation committees will be removed due to a material conflict

delegate approval process will be the same but if prices have gone up or down, the delegate will be auto amended based on the delegations policy. delegate can accept or reject.

Contract drafting

AI will know which template to use based on how it was tendered eg if a panel was used then AI will select and populate the template for that specific panel. The legal team will then be able to review the draft and make requried edits along with the users/stakeholders/advisors/ procurement etc.

AI will be able to make all required inputs into the draft contract based on the requirements of the procurement plan, evaluation report, user comments, and the suppliers' submissions and demonstrations

if a negotiation is needed then AI will capture the verbal and written agreements and update the draft contract and evaluation report accordingly.

contract signing or signed contract

If possible, it would be ideal if we can build a digital stamp functionality for external users such as customers since internal stamps will be used. this will require suppliers to have external profiles set up in the system.

would be good if sequential or simultaneous signing can be done if multiple parties are involved

Contract Management

If dates and timings change, it will be auto updated across all documents

auto alerts are pre-populated for all contract end dates, milestones/deliverables, optional extensions, notice periods for each contract eg 90 days termination periods will be notified 150 days in advanced.

users can also manually or verbally tell AI to add more alerts eg add an alert for 1 year before the contract expires and also include who ever is in my manager's role at that time

AI will auto build and update a gantt chart of all upcoming end of life and optional extension contracts. this can be in its entirely, split by business units/ cost centires/ category of goods and services etc

contract and risk management plans will be auto created based on the contract itself and it can be amended by users using voice and text. when it's finalised, the AI will auto fill the reminder alert via email, teams, slack and the platform. when there is a meeting or action required, it will take notes and complete the contract management templates. it will also help users score the supplier and help users better manage the supplier and help the supplier better deliver. alerts will also go the suppliers to ensure both parties deliver on requirements

Extensions/ Variations/Optional extensions

If dates and timings change, it will be auto updated across all documents

AI will auto generate optional extension letters based on each entities' templates. AI will help prepare a value for money justification or any documentation required by the entity to extend or vary the contract eg if a delegate needs to approve then it will send all the required document/information to the delegate for approval. if a legal team is required to be consulted then they will be alerted for review. procurement or users can also add additional people for consultation and review before delegate approval.

AI to be able to draft extension/variation notice/letters and have legal review it

AI for supplier platform

If dates and timings change, it will be auto updated across all documents

if possible, suppliers can be helped by AI in a more complete matter for when they want to submit on the platform.

in the future it would be great if a supplier just needs to register once and they are registered across all enterprises and they can also use it to improve their submissions.

suppliers can amend their rate cards, COGS etc live on the platform for transactional products

AI for direct and indirect procurements

Director (primary goods)

different forms of procurements

AI for repeated ordering of goods or services (eg paper, fruit, catering, raw materials, beverages etc)

transactional goods and services like paper, fruits, catering, raw materials, etc can be auto ordered eg weekly fruit delivery to offices

Data migration

AI to easily migrate customer data and prepopulating all required fields to form records eg current and expired contracts linked to procurements documentation.

alerts will auto populate along with all other contract and lifecycle management activities
