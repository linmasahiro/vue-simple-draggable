/**
 * A Simple Draggable Sample
 * 
 * @date   2020/04/07
 * @author Lin Masahiro(k80092@hotmail.com)
 */
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
            listData: defaultListData,
            currentListIndex: null,
            currentRowIndex: null,
        }
    },
    methods: {
        addList() {
            this.listData.push([])
        },
        setAllListNormalStyle() {
            for (let i in this.$refs.list) {
                this.$refs.list[i].style.background = "#f1c4c4"
            }
        },
        setListNormalStyle(currentElement) {
            currentElement.style.background = "#f1c4c4"
        },
        setListCurrentStyle(currentElement) {
            currentElement.style.background = "#c3c4f2"
        },
        setBlockCurrentStyle(currentElement) {
            currentElement.style.opacity = 0.5
            currentElement.style.border = "2px dotted black"
        },
        setBlockNormalStyle(currentElement) {
            currentElement.style.opacity = 1
            currentElement.style.border = "2px solid white"
        },
        clearCurrentInfo() {
            this.currentListIndex = null
            this.currentRowIndex = null
        },
        moveList(currentIndex, targetIndex) {
            return new Promise((resolve, reject) => {
                this.listData[targetIndex].push(this.listData[currentIndex][this.currentRowIndex])
                this.listData[currentIndex].splice(this.currentRowIndex, 1)
                this.currentListIndex = targetIndex
                this.currentRowIndex = this.listData[targetIndex].length - 1
                resolve()
            })
        },
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
        dragStart(e, listIndex, rowIndex) {
            this.setBlockCurrentStyle(e.target)
            this.currentListIndex = listIndex
            this.currentRowIndex = rowIndex
        },
        dragenter(e, targetListIndex) {
            if (!e.fromElement) {
                return
            }
            let element = null
            let className = e.target.className
            switch (className) {
                case "block":
                    let targetCurrentArr = e.toElement.attributes.position.value.split("_")
                    let targetRowIndex = targetCurrentArr[1]
                    if (targetListIndex == this.currentListIndex && targetRowIndex == this.currentRowIndex) {
                        return
                    }
                    element = e.toElement.parentNode.parentNode
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
                    element = e.toElement.parentNode
                    if (this.currentListIndex != targetListIndex) {
                        this.setBlockNormalStyle(this.$refs["block_" + this.currentListIndex + "_" + this.currentRowIndex][0])
                        this.moveList(this.currentListIndex, targetListIndex).then(() => {
                            this.setBlockCurrentStyle(this.$refs["block_" + this.currentListIndex + "_" + this.currentRowIndex][0])
                        })
                    }
                    break
                case "list":
                    element = e.toElement
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
        dragover(e) {
            e.preventDefault();
        },
        dragEnd(e) {
            this.setListNormalStyle(this.$refs.list[this.currentListIndex])
            this.setBlockNormalStyle(this.$refs["block_" + this.currentListIndex + "_" + this.currentRowIndex][0])
            this.clearCurrentInfo()
        }
    }
})