import TabularResults from '../components/TabularResults';
import TemplateResults from '../components/TemplateResults';
import DefaultTemplate from '../components/DefaultTemplate';

export default function Content({ data, columns, template, emptyMessage, selectedId, selectRow, className, visible, error}) {
	if (data.length > 0) {
		if (columns) {
			return (
				<div style={{ maxHeight: "200px", overflowY: "scroll" }} className="d-flex">
					<TabularResults columns={columns} data={data} selectedId={selectedId} selectRow={selectRow} />
				</div>
			)
		}

		return (
				<div style={{ maxHeight: "200px", overflowY: "scroll" }} className="d-flex">
					<TemplateResults template={template} data={data} selectedId={selectedId} selectRow={selectRow} />
				</div>
		)
	}

	if (!visible) return null;

	return (
		<div style={{ maxHeight: "200px", overflowY: "scroll" }} className="d-flex">
			<DefaultTemplate emptyMessage={emptyMessage} error={error} feedbackClassName={className} visible={visible} />
		</div>
	)
}