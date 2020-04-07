/**
 * A Simple Draggable Sample
 * 
 * @date   2020/04/07
 * @author Lin Masahiro(k80092@hotmail.com)
 */
const defaultListData = [
    [{
            title: "ROW 1"
        },
        {
            title: "ROW 2"
        },
        {
            title: "ROW 3"
        },
        {
            title: "ROW 4"
        }
    ],
    [{
        title: "ROW 5"
    }],
]

new Vue({
    el: '#app',
    data() {
        return {
            listData: defaultListData,
            currentListIndex: null,
            currentRowIndex: null,
            targetListIndex: null
        }
    },
    methods: {
        dragStart(e, listIndex, rowIndex) {
            e.target.style.opacity = 0.5
            this.currentListIndex = listIndex
            this.currentRowIndex = rowIndex
        },
        dragOver(listIndex) {
            this.targetListIndex = listIndex
        },
        dragEnd(e) {
            let listData = this.listData
            if (this.currentListIndex != this.targetListIndex) {
                listData[this.targetListIndex].push(listData[this.currentListIndex][this.currentRowIndex])
                listData[this.currentListIndex].splice(this.currentRowIndex, 1)
            }
            this.targetListIndex = null
            this.currentListIndex = null
            this.currentRowIndex = null
            e.target.style.opacity = 1
        }
    }
})