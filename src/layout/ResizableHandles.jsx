import React from "react";
import RGL, { WidthProvider } from "react-grid-layout";
import "./ResizableHandles.css";
import PostForm from "../components/form/Form";
import DisplayData from "../components/dataDisplay/DisplayData";

const ReactGridLayout = WidthProvider(RGL);

class ResizableHandles extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      dataUpdated: false, // Add state to track if data is updated
    };
  }

  static defaultProps = {
    className: "layout",
    items: 3,
    rowHeight: 80,
    onLayoutChange: () => {},
    cols: 4,
  };

  // Generate initial layout for the grid
  generateLayout() {
    const { cols } = this.props;
    const totalCols = cols;
    const availableHandles = ["s", "w", "e", "n", "sw", "nw", "se", "ne"];
  
    const itemWidth = totalCols / 2;
  
    const layouts = [
      {
        i: "0",
        x: 0,
        y: 0,
        w: itemWidth,
        h: 3,
        resizeHandles: availableHandles,
      },
      {
        i: "1",
        x: itemWidth,
        y: 0,
        w: itemWidth,
        h: 3,
        resizeHandles: availableHandles,
      },
      {
        i: "2",
        x: 0,
        y: 3,
        w: totalCols,
        h: 3,
        resizeHandles: availableHandles,
      },
    ];
  
    // Set isDraggable to false for each item
    return layouts.map((item) => ({
      ...item,
      isDraggable: false,
    }));
  }

  // Handle layout change event
  onLayoutChange = (layout) => {
    this.props.onLayoutChange(layout); // Invoke callback with new layout
  };

  // Handle resize stop event
  onResizeStop = (layout, oldItem, newItem) => {
    const { items, cols } = this.props;
    const totalCols = cols;

    // Calculate total width of all items in layout
    let totalWidth = 0;
    layout.forEach((item) => {
      totalWidth += item.w;
    });

    // Calculate width for each item based on total width and number of items
    const itemWidth = Math.min(window.innerWidth / items, totalWidth / items);

    // Update layout to adjust widths of neighboring components
    const updatedLayout = layout.map((item, index) => {
      if (index === 0 || index === 1) {
        // Adjust width of neighboring components
        return {
          ...item,
          w: itemWidth,
        };
      } else if (index === 2) {
        // Adjust width of last component to fill remaining space
        return {
          ...item,
          w: totalCols - itemWidth,
        };
      } else {
        return item;
      }
    });

    // Update layout
    this.onLayoutChange(updatedLayout);
  };

  // Callback function to be passed to PostForm to update data
  handleDataUpdate = () => {
    this.setState({ dataUpdated: true });
  };

  render() {
    const { className, rowHeight } = this.props;
    return (
      <ReactGridLayout
        className={className}
        layout={this.generateLayout()}
        onLayoutChange={this.onLayoutChange}
        cols={this.props.cols}
        rowHeight={rowHeight}
        onResizeStop={this.onResizeStop}
      >
        <div key="0" className="div_1">
          <PostForm onDataUpdate={this.handleDataUpdate} />
        </div>

        <div key="1" className="div_2">
         <h1>Ajay</h1>
        </div>
        
        <div key="2" className="div-3">
          <DisplayData key="displayData2" shouldUpdate={this.state.dataUpdated} />
        </div>
      </ReactGridLayout>
    );
  }
}

export default ResizableHandles;
