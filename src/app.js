/**
 * A Draggable(Drag and Drop) base on HTML5 and Vue.js
 * 
 * @date   2020/04/07
 * @author Lin Masahiro(k80092@hotmail.com)
 * @see https://github.com/linmasahiro/vue-simple-draggable
 */


// defined a array
const defaultListData = [
    [{
            title: "BLOCK A"
        },
        {
            title: "BLOCK B"
        },
        {
            title: "BLOCK C"
        },
        {
            title: "BLOCK D"
        }
    ],
    [{
        title: "BLOCK E"
    }],
]

new Vue({
    el: '#app',
    data() {
        return {
            listAreaClass: "list-area",
            defaultListClass: "list",
            currentListClass: "list-current",
            defaultBlockClass: "block",
            currentBlockClass: "block-current",
            listData: defaultListData,
            currentListIndex: null,
            currentRowIndex: null,
        }
    },
    methods: {
        /**
         * Push a new list
         * 
         * @returns void
         */
        addList() {
            this.listData.push([])
        },
        /**
         * All list element's class back to default class
         * 
         * @returns void
         */
        setAllListNormalStyle() {
            for (let i in this.$refs.list) {
                this.$refs.list[i].classList.value = this.defaultListClass
            }
        },

        /**
         * Set a list element's class to default class
         * 
         * @param object currentElement Element
         * 
         * @returns void
         */
        setListNormalStyle(currentElement) {
            currentElement.classList.value = this.defaultListClass
        },

        /**
         * Add current class to list element
         * 
         * @param object currentElement Element
         * 
         * @returns void
         */
        setListCurrentStyle(currentElement) {
            currentElement.classList.value = this.defaultListClass + " " + this.currentListClass
        },

        /**
         * A block element's class back to default class
         * 
         * @param object currentElement Element
         * 
         * @returns void
         */
        setBlockNormalStyle(currentElement) {
            currentElement.classList.value = this.defaultBlockClass
        },

        /**
         * Add current class to block element
         * 
         * @param object currentElement Element
         * 
         * @returns void
         */
        setBlockCurrentStyle(currentElement) {
            currentElement.classList.value = this.defaultBlockClass + " " + this.currentBlockClass
        },

        /**
         * Clear any current data
         * 
         * @returns void
         */
        clearCurrentInfo() {
            this.currentListIndex = null
            this.currentRowIndex = null
        },

        /**
         * Move current block to other list
         * 
         * @param int currentIndex 'Current list index'
         * @param int targetIndex  'Target list index'
         * 
         * @returns promise object
         */
        moveList(currentIndex, targetIndex) {
            return new Promise((resolve, reject) => {
                this.listData[targetIndex].push(this.listData[currentIndex][this.currentRowIndex])
                this.listData[currentIndex].splice(this.currentRowIndex, 1)
                this.currentListIndex = targetIndex
                this.currentRowIndex = this.listData[targetIndex].length - 1
                resolve()
            })
        },

        /**
         * Move block position on list
         * 
         * @param int targetListIndex 'List index'
         * @param int currentRowIndex 'Current block index'
         * @param int targetRowIndex  'Target block index'
         * 
         * @returns promise object
         */
        moveRows(targetListIndex, currentRowIndex, targetRowIndex) {
            return new Promise((resolve, reject) => {
                let tmp = this.listData[targetListIndex][currentRowIndex]
                if (targetRowIndex > currentRowIndex) {
                    for (let i = (currentRowIndex + 1); i <= targetRowIndex; i++) {
                        this.listData[targetListIndex][i - 1] = this.listData[targetListIndex][i]
                    }
                } else {
                    for (let i = currentRowIndex; i > targetRowIndex; i--) {
                        this.listData[targetListIndex][i] = this.listData[targetListIndex][i - 1]
                    }
                }
                this.listData[targetListIndex][targetRowIndex] = tmp
                this.$forceUpdate()
                resolve()
            })
        },

        /**
         * Drag start event
         * 
         * @param object e 'Drag event'
         * @param int listIndex 'Current list index'
         * @param int rowIndex  'Current block index'
         * 
         * @returns void
         */
        dragStart(e, listIndex, rowIndex) {
            this.setBlockCurrentStyle(e.target)
            this.currentListIndex = listIndex
            this.currentRowIndex = rowIndex
        },

        /**
         * Drag enter event
         * 
         * @param object e 'Drag event'
         * @param int targetListIndex 'Enter list index'
         * 
         * @returns void
         */
        dragenter(e, targetListIndex) {
            let element = null
            let className = e.target.className
            switch (className) {
                case "block":
                    let targetCurrentArr = e.target.attributes.position.value.split("_")
                    let targetRowIndex = targetCurrentArr[1]
                    if (targetListIndex == this.currentListIndex && targetRowIndex == this.currentRowIndex) {
                        return
                    }
                    element = e.target.parentNode.parentNode
                    this.setBlockNormalStyle(this.$refs["block_" + this.currentListIndex + "_" + this.currentRowIndex][0])
                    if (targetListIndex != this.currentListIndex) {
                        this.moveList(this.currentListIndex, targetListIndex).then(() => {
                            this.moveRows(targetListIndex, this.currentRowIndex, targetRowIndex).then(() => {
                                this.currentListIndex = parseInt(targetListIndex)
                                this.currentRowIndex = parseInt(targetRowIndex)
                                this.setBlockCurrentStyle(this.$refs["block_" + this.currentListIndex + "_" + this.currentRowIndex][0])
                            })
                        })
                    } else {
                        this.moveRows(targetListIndex, this.currentRowIndex, targetRowIndex).then(() => {
                            this.currentListIndex = parseInt(targetListIndex)
                            this.currentRowIndex = parseInt(targetRowIndex)
                            this.setBlockCurrentStyle(this.$refs["block_" + this.currentListIndex + "_" + this.currentRowIndex][0])
                        })
                    }
                    break
                case "block-wrap":
                case "list-name":
                    element = e.target.parentNode
                    if (this.currentListIndex != targetListIndex) {
                        this.setBlockNormalStyle(this.$refs["block_" + this.currentListIndex + "_" + this.currentRowIndex][0])
                        this.moveList(this.currentListIndex, targetListIndex).then(() => {
                            this.setBlockCurrentStyle(this.$refs["block_" + this.currentListIndex + "_" + this.currentRowIndex][0])
                        })
                    }
                    break
                case "list":
                    element = e.target
                    if (this.currentListIndex != targetListIndex) {
                        this.setBlockNormalStyle(this.$refs["block_" + this.currentListIndex + "_" + this.currentRowIndex][0])
                        this.moveList(this.currentListIndex, targetListIndex).then(() => {
                            this.setBlockCurrentStyle(this.$refs["block_" + this.currentListIndex + "_" + this.currentRowIndex][0])
                        })
                    }
                    break
                default:
                    break
            }
            if (element) {
                this.setAllListNormalStyle()
                this.setListCurrentStyle(element)
            }
        },

        /**
         * Drag over event
         * 
         * ※We need this event, because i need to stop HTML5 drag animation!
         * 
         * @param object e 'Drag event'
         * 
         * @returns void
         */
        dragover(e) {
            e.preventDefault();
        },

        /**
         * Drag end event
         * 
         * @returns void
         * 
         * @see https://developer.mozilla.org/en-US/docs/Web/API/Document/drop_event#Example
         */
        dragEnd() {
            this.setListNormalStyle(this.$refs.list[this.currentListIndex])
            this.setBlockNormalStyle(this.$refs["block_" + this.currentListIndex + "_" + this.currentRowIndex][0])
            this.clearCurrentInfo()
        }
    }
})